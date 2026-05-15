import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).notNull(),
  email: varchar("email", { length: 322 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),

  password: varchar("password", { length: 66 }),
  salt: text("salt"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
export const pollsTable = pgTable("polls", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", { length: 255 }).notNull(),

  description: text("description"),

  creatorId: uuid("creator_id")
    .references(() => usersTable.id)
    .notNull(),

  isAnonymous: boolean("is_anonymous").default(false).notNull(),

  expiresAt: timestamp("expires_at"),

  isPublished: boolean("is_published").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const questionsTable = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),

  pollId: uuid("poll_id")
    .references(() => pollsTable.id)
    .notNull(),

  questionText: text("question_text").notNull(),

  isRequired: boolean("is_required").default(false).notNull(),

  orderIndex: integer("order_index").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const optionsTable = pgTable("options", {
  id: uuid("id").primaryKey().defaultRandom(),

  questionId: uuid("question_id")
    .references(() => questionsTable.id)
    .notNull(),

  optionText: text("option_text").notNull(),
});
export const responsesTable = pgTable("responses", {
  id: uuid("id").primaryKey().defaultRandom(),

  pollId: uuid("poll_id")
    .references(() => pollsTable.id)
    .notNull(),

  userId: uuid("user_id").references(() => usersTable.id),

  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});
export const answersTable = pgTable("answers", {
  id: uuid("id").primaryKey().defaultRandom(),

  responseId: uuid("response_id")
    .references(() => responsesTable.id)
    .notNull(),

  questionId: uuid("question_id")
    .references(() => questionsTable.id)
    .notNull(),

  selectedOptionId: uuid("selected_option_id")
    .references(() => optionsTable.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pollsRelations = relations(pollsTable, ({ many }) => ({
  questions: many(questionsTable),
}));

export const questionsRelations = relations(
  questionsTable,
  ({ one, many }) => ({
    poll: one(pollsTable, {
      fields: [questionsTable.pollId],
      references: [pollsTable.id],
    }),

    options: many(optionsTable),
  }),
);

export const optionsRelations = relations(optionsTable, ({ one }) => ({
  question: one(questionsTable, {
    fields: [optionsTable.questionId],
    references: [questionsTable.id],
  }),
}));
