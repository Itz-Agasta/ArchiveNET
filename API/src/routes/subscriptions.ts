import express from 'express';
import { type Request, type Response } from 'express';
import { createUserSubscription, getUserSubscription, updateUserSubscription } from '../database/models/userSubscriptions.js';
import { verifyTransaction } from '../utils/etherscan.js';

const router = express.Router();

router.post('/create', async (req: Request, res: Response) => {
    try{
        const { userId, email, plan, quotaLimit, renewsAt, txHash } = req.body;
        const txn = await verifyTransaction(txHash);
        const result = txn.result;
        console.log(result.data);
        if(result.isError === "0"){
            const exisitingSubscription = await getUserSubscription(userId);
            if (exisitingSubscription) {
                res.status(409).json({
                    success: false,
                    message: 'Subscription already exists for this user',
                });
                return;
            }
            const subscriptionData = {
                userId,
                email,
                plan,
                quotaLimit,
                renewsAt: new Date(renewsAt),
            }

            const newSubscription = await createUserSubscription(subscriptionData);
            const subscription = newSubscription[0];
            if (!subscription) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to create subscription',
                });
                return;
            }
            res.status(201).json({
                success: true,
                message: 'Subscription created successfully',
                subscription: {
                    id: subscription.id,
                    userId: subscription.userId,
                    plan: subscription.plan,
                    quotaLimit: subscription.quotaLimit,
                    quotaUsed: subscription.quotaUsed,
                    isActive: subscription.isActive,
                    renewsAt: subscription.renewsAt.toISOString(),
                    createdAt: subscription.createdAt,
                },
            });
            }else {
                res.status(400).json({
                    success: false,
                    message: 'Transaction verification failed',
                    error: result.message || 'Unknown error',
                });
                return;
            }
    }catch (error) {
        console.error('Subscription creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create subscription',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
})

router.get('/:userId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const subscription = await getUserSubscription(userId);
        
        if (!subscription) {
            res.status(404).json({
                success: false,
                message: 'Subscription not found',
            });
            return;
        }
        
        res.json({
            success: true,
            subscription: {
                id: subscription.id,
                userId: subscription.userId,
                plan: subscription.plan,
                quotaLimit: subscription.quotaLimit,
                quotaUsed: subscription.quotaUsed,
                isActive: subscription.isActive,
                renewsAt: subscription.renewsAt.toISOString(),
                createdAt: subscription.createdAt,
            },
        });
    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve subscription',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

router.put('/update/:userId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const { plan, quotaLimit, quotaUsed, isActive, renewsAt } = req.body;
        const updates = {
            plan,
            quotaLimit,
            quotaUsed,
            isActive,
            renewsAt: renewsAt ? new Date(renewsAt) : undefined,
        };
        const updatedSubscription = await updateUserSubscription(userId,{
            plan: updates.plan,
            quotaLimit: updates.quotaLimit,
            quotaUsed: updates.quotaUsed,
            isActive: updates.isActive,
            renewsAt: updates.renewsAt,
        });
        if (!updatedSubscription || updatedSubscription.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Subscription not found or no updates made',
            });
            return;
        }
        res.json({
            success: true,
            message: 'Subscription updated successfully',
            updatedSubscription,
        });
    } catch (error) {
        console.error('Update subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update subscription',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

export default router;