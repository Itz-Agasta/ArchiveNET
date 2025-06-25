import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

/**
 * Instance-Keys Table Schema
 *
 * @Notes
 * - One user can have multiple API keys (1:N relationship)
 * - Each key can be independently activated/deactivated
 * - Keys link to the the Arweave wallet used to deploy its contract
 */
export const keysTable = pgTable(
	"keys",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		clerkId: text("clerk_id").notNull(),
		instanceKeyHash: text("instance_key_hash").notNull().unique(),
		arweaveWalletAddress: text("arweave_wallet_address"),
		isActive: boolean("is_active").notNull().default(false),
		lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
	},
	(table) => ({
		clerkIdIdx: index("instances_clerk_id_idx").on(table.clerkId),
		activeInstancesIdx: index("active_instances_idx").on(table.isActive),
		keyHashIdx: index("instance_key_hash_idx").on(table.instanceKeyHash),
	}),
);

// Keys ---> Users Relationship (many-to-one)
export const instanceRelations = relations(keysTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [keysTable.clerkId],
		references: [usersTable.clerkId],
	}),
}));

// Users ---> keys Relationship (one-to-many)
export const userInstanceRelations = relations(usersTable, ({ many }) => ({
	instances: many(keysTable),
}));
