import { generateUniqueId } from '~/lib/utils';
import { relations } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp, unique, varchar } from 'drizzle-orm/pg-core';

// References:
// https://orm.drizzle.team/docs/rqb

const ID_LENGTH = 14;

export const users = pgTable('users', {
  id: varchar('id', { length: ID_LENGTH })
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateUniqueId()),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userSessions = pgTable(
  'user_sessions',
  {
    id: varchar('id', { length: ID_LENGTH })
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateUniqueId()),
    userId: varchar('user_id', { length: ID_LENGTH })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    userAgent: text('user_agent').notNull(),
    ipAddress: text('ip_address').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    expiresAt: timestamp('expires_at'),
  },
  t => {
    return {
      userIdIdx: index().on(t.userId),
      expiresAtIdx: index().on(t.expiresAt),
    };
  },
);

export const userProfiles = pgTable('user_profiles', {
  id: varchar('id', { length: ID_LENGTH })
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateUniqueId()),
  firstName: text('first_name'),
  firstLast: text('last_name'),
  userId: varchar('user_id', { length: ID_LENGTH })
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const passwords = pgTable('passwords', {
  id: varchar('id', { length: 14 })
    .primaryKey()
    .$defaultFn(() => generateUniqueId())
    .notNull(),
  hash: text('hash').notNull(),
  userId: varchar('user_id', { length: 14 })
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userConnectedAccouns = pgTable(
  'user_connected_accounts',
  {
    id: varchar('id', { length: ID_LENGTH })
      .primaryKey()
      .$defaultFn(() => generateUniqueId())
      .notNull(),
    userId: varchar('user_id', { length: ID_LENGTH })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    providerName: text('provider_name').notNull(), // GitHub, Google, etc.
    providerAccountId: text('provider_account_id').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  t => ({
    unq: unique().on(t.providerName, t.providerAccountId),
  }),
);

export const usersRelations = relations(users, ({ one }) => ({
  password: one(passwords, {
    fields: [users.id],
    references: [passwords.userId],
  }),
  userProfile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  userSessions: one(userSessions, {
    fields: [users.id],
    references: [userSessions.userId],
  }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

export const verifications = pgTable(
  'verifications',
  {
    id: varchar('id', { length: 14 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateUniqueId()),
    type: text('type').notNull(),
    secret: text('secret').notNull(),
    target: text('target').notNull(),
    period: integer('period').notNull(),
    algorithm: text('algorithm').notNull(),
    digits: integer('digits').notNull(),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  t => ({
    unq: unique().on(t.target, t.type),
  }),
);

// Types
export type NewPassword = typeof passwords.$inferInsert;
export type NewUser = typeof users.$inferInsert;
export type NewUserProfile = typeof userProfiles.$inferInsert;
export type NewUserSession = typeof userSessions.$inferInsert;
export type NewVerification = typeof verifications.$inferInsert;

export type Password = typeof passwords.$inferSelect;
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type UserSession = typeof userSessions.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
