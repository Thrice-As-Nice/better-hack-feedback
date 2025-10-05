import { db, feedback } from '../drizzle/schema'
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

    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    // Parse request body
    const body = await readBody(event)
    const { rating, liked, improvements } = body

    // Validate required fields
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Rating must be a number between 1 and 5',
      })
    }

    // Generate unique ID (using timestamp + random string)
    const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // Insert new feedback into database
    const newFeedback = await db.insert(feedback).values({
      id: feedbackId,
      userId: session.user.id,
      rating_count: rating,
      positive_feedback: liked?.trim() || null,
      negative_feedback: improvements?.trim() || null,
    }).returning()

    return {
      success: true,
      feedback: newFeedback[0],
    }
  } catch (error) {
    console.error('Error creating feedback:', error)
    
    // If it's already a HTTP error, re-throw it
    if (error.statusCode) {
      throw error
    }

    // Otherwise, return a generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit feedback',
    })
  }
})
