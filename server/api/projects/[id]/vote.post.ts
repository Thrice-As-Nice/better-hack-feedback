import { db, projects, votes } from '../../../drizzle/schema'
import { auth } from '../../../lib/auth'
import { eq, and, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Only allow POST requests
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    })
  }

  try {
    // Verify user is authenticated
    const session = await auth.api.getSession({
      headers: getHeaders(event),
    })

    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    // Get project ID from URL params
    const projectId = getRouterParam(event, 'id')
    if (!projectId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Project ID is required',
      })
    }

    // Check if project exists
    const project = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1)
    if (project.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found',
      })
    }

    // Check if user has already voted for this project
    const existingVote = await db
      .select()
      .from(votes)
      .where(and(eq(votes.userId, session.user.id), eq(votes.projectId, projectId)))
      .limit(1)

    if (existingVote.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'You have already voted for this project',
      })
    }

    // Use database transaction to ensure consistency
    const result = await db.transaction((tx) => {
      // Create the vote record
      const voteId = `vote_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

      tx.insert(votes)
        .values({
          id: voteId,
          userId: session.user.id,
          projectId: projectId,
        })
        .run()

      // Increment the project's vote count
      tx.update(projects)
        .set({
          vote_count: sql`${projects.vote_count} + 1`,
        })
        .where(eq(projects.id, projectId))
        .run()

      // Get the updated project
      const updatedProject = tx.select().from(projects).where(eq(projects.id, projectId)).get()

      return updatedProject
    })

    return {
      success: true,
      project: result,
      message: 'Vote recorded successfully',
    }
  } catch (error) {
    console.error('Error recording vote:', error)

    // If it's already a HTTP error, re-throw it
    if (error.statusCode) {
      throw error
    }

    // Otherwise, return a generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to record vote',
    })
  }
})
