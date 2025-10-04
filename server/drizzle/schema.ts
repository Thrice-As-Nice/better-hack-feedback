import { drizzle } from 'drizzle-orm/better-sqlite3'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import Database from 'better-sqlite3'
import path from 'path'

const dbFile = path.resolve(process.cwd(), 'server', 'data', 'db.sqlite')

const sqlite = new Database(dbFile)

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({
    autoIncrement: true,
  }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
})

export const db = drizzle(sqlite, {
  schema: { users },
})
