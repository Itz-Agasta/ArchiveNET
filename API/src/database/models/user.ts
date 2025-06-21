import { db } from '../db.js';
import { userTable } from '../schemas/user.js';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

type User = InferSelectModel<typeof userTable>;

export async function getUserById(userId: string): Promise<User | undefined> {
    return await db.query.userTable.findFirst({
        where: eq(userTable.id, userId),
    });
}

export async function createUser(
    username: string,
    email: string,
    fullName: string,
    metaMaskWalletAddress?: string,
    status? : 'active' | 'suspended' | 'deleted'
): Promise<User | undefined> {
    const [newUser] = await db.insert(userTable).values({
        username,
        email,
        fullName,
        metaMaskWalletAddress,
        status: status || 'active', // Default to 'active' if not provided
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning();

    return newUser;
}

export async function updateUser(
    userId: string,
    status: 'active' | 'suspended' | 'deleted',
): Promise<User | undefined> {  
    const [updatedUser] = await db.update(userTable)
        .set({
            status,
            updatedAt: new Date(),
        })
        .where(eq(userTable.id, userId))
        .returning();

    return updatedUser;
}

export async function deleteUser(userId: string): Promise<any> // #TODO: Replace 'any' with the actual return type
{
    const deletedUser = await db.delete(userTable)
        .where(eq(userTable.id, userId)).returning();
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
    return await db.query.userTable.findFirst({
        where: eq(userTable.email, email),
    });
}