import { db, feedback, user } from '../drizzle/schema'
import { auth } from '../lib/auth'
import { requireAuthorization } from '../lib/admin'
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

    // Check if user is authorized (admin)
    await requireAuthorization(event)

    // Fetch all feedbacks with user information, ordered by creation date (newest first)
    const allFeedbacks = await db
      .select({
        id: feedback.id,
        rating: feedback.rating_count,
        positiveFeedback: feedback.positive_feedback,
        negativeFeedback: feedback.negative_feedback,
        createdAt: feedback.createdAt,
        updatedAt: feedback.updatedAt,
        user: {
          id: user.id,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        },
      })
      .from(feedback)
      .leftJoin(user, eq(feedback.userId, user.id))
      .orderBy(desc(feedback.createdAt))

    return {
      success: true,
      feedbacks: allFeedbacks,
      count: allFeedbacks.length,
    }
  } catch (error) {
    console.error('Error fetching feedbacks:', error)
    
    // If it's already a HTTP error, re-throw it
    if (error.statusCode) {
      throw error
    }

    // Otherwise, return a generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch feedbacks',
    })
  }
})
