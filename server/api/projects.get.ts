import { db, projects, votes } from '../drizzle/schema'
import { auth } from '../lib/auth'
import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
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

    // Fetch all projects
    const allProjects = await db.select().from(projects).orderBy(desc(projects.vote_count))

    // Get user's votes to determine which projects they've voted for
    const userVotes = await db
      .select({ projectId: votes.projectId })
      .from(votes)
      .where(eq(votes.userId, session.user.id))

    const votedProjectIds = new Set(userVotes.map((vote) => vote.projectId))
    const totalUserVotes = userVotes.length

    // Add hasVoted flag to each project
    const projectsWithVoteStatus = allProjects.map((project) => ({
      ...project,
      hasVoted: votedProjectIds.has(project.id),
    }))

    return {
      success: true,
      projects: projectsWithVoteStatus,
      userVoteCount: totalUserVotes,
      maxVotes: 3,
      remainingVotes: Math.max(0, 3 - totalUserVotes),
    }
  } catch (error) {
    console.error('Error fetching projects:', error)

    // If it's already a HTTP error, re-throw it
    if (error.statusCode) {
      throw error
    }

    // Otherwise, return a generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch projects',
    })
  }
})
