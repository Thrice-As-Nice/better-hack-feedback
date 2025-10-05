import { db, projects } from '../drizzle/schema'
import { auth } from '../lib/auth'

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

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    // Parse request body
    const body = await readBody(event)
    const { name, description, groupName } = body

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Project name is required',
      })
    }

    // Generate unique ID (using timestamp + random string)
    const projectId = `project_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // Insert new project into database
    const newProject = await db.insert(projects).values({
      id: projectId,
      name: name.trim(),
      description: description?.trim() || null,
      groupName: groupName?.trim() || null,
      vote_count: 0,
    }).returning()

    return {
      success: true,
      project: newProject[0],
    }
  } catch (error) {
    console.error('Error creating project:', error)
    
    // If it's already a HTTP error, re-throw it
    if (error.statusCode) {
      throw error
    }

    // Otherwise, return a generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create project',
    })
  }
})
