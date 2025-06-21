import { db } from '../db.js';
import { userSubscriptionTable } from '../schemas/userSubscriptions.js';
import { eq } from 'drizzle-orm';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

type UserSubscription = InferSelectModel<typeof userSubscriptionTable>;
type NewUserSubscription = InferInsertModel<typeof userSubscriptionTable>;

export async function createUserSubscription(subscriptionData: {
    userId: string;
    plan: "basic" | "pro" | "enterprise";
    quotaLimit: number;
    quotaUsed?: number;
    isActive?: boolean;
    renewsAt: Date;
}): Promise<NewUserSubscription[]> {
    const data: NewUserSubscription = {
        ...subscriptionData,
        quotaUsed: subscriptionData.quotaUsed ?? 0,
        isActive: subscriptionData.isActive ?? true,
    };

    const subscription = await db.insert(userSubscriptionTable).values(data).returning();
    return subscription;
}

export async function getUserSubscription(
    userId: string,
): Promise<UserSubscription | undefined> {
    return await db.query.userSubscriptionTable.findFirst({
        where: eq(userSubscriptionTable.userId, userId),
        with: {
            user: true, // Assuming you want to include user details
        },
    });
}

export async function updateUserSubscription(
    userId: string,
    updates: Partial<Pick<NewUserSubscription, 'plan' | 'quotaLimit' | 'quotaUsed' | 'isActive' | 'renewsAt'>>
): Promise<UserSubscription[]> {
    return await db.update(userSubscriptionTable)
        .set({
            ...updates,
        })
        .where(eq(userSubscriptionTable.userId, userId))
        .returning();
}

export async function deleteUserSubscription(userId: string): Promise<void> {
    await db.delete(userSubscriptionTable)
        .where(eq(userSubscriptionTable.userId, userId));
}
