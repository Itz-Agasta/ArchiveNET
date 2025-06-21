import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';

export const createSubscription = async (username: string, plan: string, fullName: string, email: string, txHash: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/subscriptions/create`, {
            username,
            plan,
            fullName,
            email,
            txHash
        });
        if (response.status === 201) {
            return response.data;
        } else {
            throw new Error('Failed to create subscription');
        }
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
    }
}

export const getInstances = async (userId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/instances/${userId}`);
        if (response.status === 200) {
            return response.data.instance;
        } else {
            throw new Error('Failed to retrieve instance key');
        }
    } catch (error) {
        console.error('Error retrieving instance key:', error);
        throw error;
    }
}

export const deployContract = async (userId: string) => {
    try{
        const response = await axios.post(`${BASE_URL}/deploy/contract`, { userId });
        return response.data;
    }catch (error) {
        console.error('Error deploying contract:', error);
        throw error;
    }
}

export const createInstance = async (userId: string, username: string, email: string, fullName: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/instances/create`, {
            userId,
            username,
            email,
            fullName,
        });
        if (response.status === 201) {
            return response.data.instance;
        } else {
            throw new Error('Failed to create instance');
        }
    } catch (error) {
        console.error('Error creating instance:', error);
        throw error;
    }
}