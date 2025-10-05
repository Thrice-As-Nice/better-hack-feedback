import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { telegramMiniAppAuth } from 'tg-mini-auth'
import { db } from '../drizzle/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  plugins: [
    telegramMiniAppAuth({
      botToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
    }),
  ],
})
