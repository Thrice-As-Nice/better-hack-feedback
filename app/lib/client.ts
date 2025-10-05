import { createAuthClient } from 'better-auth/vue'
import { betterAuthTgMiniAppClientPlugin } from 'tg-mini-auth'

export const authClient = createAuthClient({
  baseURL: 'https://tgminiappauth.share.zrok.io',
  plugins: [betterAuthTgMiniAppClientPlugin()],
})

// Helper function to extract Telegram init data from URL
export function getTelegramInitData(): string | null {
  if (typeof window === 'undefined') return null

  // The hash format from Telegram is: #tgWebAppData=<url-encoded-init-data>&tgWebAppVersion=...
  const hash = window.location.hash
  if (hash.startsWith('#tgWebAppData=')) {
    // Extract just the tgWebAppData parameter
    const hashContent = hash.substring(1) // Remove the #
    const params = new URLSearchParams(hashContent)
    const initData = params.get('tgWebAppData')
    
    if (initData) {
      // Return the URL-decoded init data string (not parsed, backend will parse it)
      const decoded = decodeURIComponent(initData)
      console.log('Sending init data to backend:', decoded)
      return decoded
    }
  }

  return null
}

// Function to authenticate with Telegram Mini App
export async function authenticateWithTelegram() {
  const initData = getTelegramInitData()
  if (!initData) {
    throw new Error('No Telegram init data found in URL')
  }

  try {
    // Use direct fetch to the custom endpoint
    const response = await $fetch('https://tgminiappauth.share.zrok.io/api/auth/sign-in/telegram-mini-app', {
      method: 'POST',
      body: { initData },
    })

    return response
  } catch (error) {
    console.error('Telegram authentication failed:', error)
    throw error
  }
}
