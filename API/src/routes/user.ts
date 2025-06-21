import express from 'express';
import { type Request, type Response } from 'express';
import { createUser, findUserByEmail } from '../database/models/user.js';

const router = express.Router();

router.post('/create', async (req: Request, res: Response) => {
    try{
        const { username, email, fullName, status } = req.body;

        const newUser = await createUser(
            username,
            email,
            fullName,
            status,
        );
        if (!newUser) {
            res.status(500).json({
                success: false,
                message: 'Failed to create user',
            });
            return;
        }
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: newUser,
        });
    } catch (error) {
        console.error('User creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
})

router.get('/:email', async (req: Request, res: Response) => {
    try {
        const userId = req.params.email;
        const user = await findUserByEmail(userId);
        
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        
        res.json({
            success: true,
            user,
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve user',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

export default router;