import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.ts', 
  out: './drizzle/migrations', 
  dialect: 'sqlite',
  casing: 'snake_case',
  dbCredentials: {
    url: './data/db.sqlite',
  },
});
