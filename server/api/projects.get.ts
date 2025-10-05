import { db, projects } from '../drizzle/schema'
import { auth } from '../lib/auth'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    // Verify user is authenticated
    const session = await auth.api.getSession({
      headers: getHeaders(event),
    })

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    // Fetch all projects, ordered by creation date (newest first)
    const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt))

    return {
      success: true,
      projects: allProjects,
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
