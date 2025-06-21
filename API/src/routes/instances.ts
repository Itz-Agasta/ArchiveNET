import express from 'express';
import type { Request, Response } from 'express';
import { getInstanceByUserId, createInstance } from '../database/models/instances.js';
import { getUserSubscription } from '../database/models/userSubscriptions.js';

const router = express.Router();

router.post('/create', async (req: Request, res: Response) => {
    try{
        const { userId, name, description, arweave_wallet_address } = req.body;
        if (!userId || !name || !description) {
            res.status(400).json({
                success: false,
                message: 'User ID, name, and description are required',
            });
            return;
        }
        // Check if instance already exists for the user
        const existingInstance = await getInstanceByUserId(userId);
        if (existingInstance) {
            res.status(409).json({
                success: false,
                message: 'Instance already exists for this user',
            });
            return;
        }

        const exisitingSubscription = await getUserSubscription(userId);
        if (!exisitingSubscription) {
            res.status(404).json({
                success: false,
                message: 'User subscription not found',
            });
            return;
        }
        // Create new instance
        const newInstance = await createInstance(
            userId,
            '', // instanceKeyHash will be set later
            name,
            description,
        );
        if (!newInstance || newInstance.length === 0) {
            res.status(500).json({
                success: false,
                message: 'Failed to create instance',
            });
            return;
        }
        const instance = newInstance[0];
        res.status(201).json({
            success: true,
            message: 'Instance created successfully',
            instance,
        });

    }catch (error) {
        console.error('Instance creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create instance',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

router.get('/:userId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const instance = await getInstanceByUserId(userId);
        
        if (!instance) {
            res.status(404).json({
                success: false,
                message: 'Instance not found for this user',
            });
            return;
        }
        
        res.json({
            success: true,
            instance,
        });
    } catch (error) {
        console.error('Get instance error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve instance',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
export default router;