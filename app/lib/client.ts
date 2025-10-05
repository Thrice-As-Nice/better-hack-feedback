import { createAuthClient } from 'better-auth/vue'
import { betterAuthTgMiniAppClientPlugin, getTelegramInitData } from 'tg-mini-auth'

export const authClient = createAuthClient({
  baseURL: 'https://tgminiappauth.share.zrok.io',
  plugins: [betterAuthTgMiniAppClientPlugin()],
})

export { getTelegramInitData }
