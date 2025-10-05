import { auth } from './auth'
import type { H3Event } from 'h3'

// Define authorized Telegram IDs
const AUTHORIZED_TELEGRAM_IDS = [
  '303411718',
  '373818478',
  // Add more Telegram IDs here as needed
]

/**
 * Middleware to check if the current user is authorized (has a telegram ID in the authorized list)
 * @param event - The H3 event object
 * @returns Promise<boolean> - Whether the user is authorized
 */
export async function isAuthorizedUser(event: H3Event): Promise<boolean> {
  try {
    // Get the session
    const session = await auth.api.getSession({
      headers: getHeaders(event),
    })

    if (!session?.user) {
      return false
    }

    // Check if user has a telegram ID and if it's in the authorized list
    const telegramId = session.user.telegramId
    if (!telegramId) {
      return false
    }

    return AUTHORIZED_TELEGRAM_IDS.includes(telegramId)
  } catch (error) {
    console.error('Error checking user authorization:', error)
    return false
  }
}

/**
 * Middleware function that throws an error if user is not authorized
 * @param event - The H3 event object
 * @throws 403 Forbidden if user is not authorized
 */
export async function requireAuthorization(event: H3Event): Promise<void> {
  const isAuthorized = await isAuthorizedUser(event)
  
  if (!isAuthorized) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - You are not authorized to perform this action',
    })
  }
}

/**
 * Get the telegram ID from the current session
 * @param event - The H3 event object
 * @returns Promise<string | null> - The telegram ID or null if not found
 */
export async function getCurrentUserTelegramId(event: H3Event): Promise<string | null> {
  try {
    const session = await auth.api.getSession({
      headers: getHeaders(event),
    })

    return session?.user?.telegramId || null
  } catch (error) {
    console.error('Error getting telegram ID:', error)
    return null
  }
}
