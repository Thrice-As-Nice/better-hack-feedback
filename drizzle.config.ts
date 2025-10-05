import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/drizzle/schema.ts',
  out: './server/drizzle/migrations',
  dialect: 'sqlite',
  casing: 'snake_case',
  dbCredentials: {
    url: './server/data/db.sqlite',
  },
})
