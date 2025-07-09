import { Request, Response } from "express";
import {AuthService} from "../../application/auth.service";
import {IAddress} from "../../domain/types/address";


const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address
        }: {
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            phoneNumber: string;
            address: IAddress;
        } = req.body;

        if (!email || !password || !firstName || !lastName || !phoneNumber || !address) {
            res.status(400).json({
                error: 'Missing required fields',
                requiredFields: [
                    'email',
                    'password',
                    'firstName',
                    'lastName',
                    'phoneNumber',
                    'address'
                ]
            });
            return;
        }

        // Validate address object
        if (!address.street || !address.city || !address.state ||
            !address.country || !address.postalCode) {
            res.status(400).json({
                error: 'Invalid address format',
                requiredAddressFields: [
                    'street',
                    'city',
                    'state',
                    'country',
                    'postalCode'
                ]
            });
            return;
        }

        const user = await authService.register(
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address
        );

        res.status(201).json({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            billingAddress: user.billingAddress,
            createdAt: user.createdAt
        });
    } catch (err: any) {
        if (err.message.includes('already exists')) {
            res.status(409).json({ error: err.message });
            return;
        }
        if (err.message.includes('Invalid')) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (err.message.includes('8 characters long')) {
            res.status(400).json({ error: err.message });
            return;
        }

        console.error('Registration error:', err);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const token = await authService.login(req.body.email, req.body.password);
        res.status(200).json(token);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        await authService.logout(req.body.token);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, phoneNumber, address }: {
            firstName?: string;
            lastName?: string;
            phoneNumber?: string;
            address?: IAddress;
        } = req.body;

        if (!firstName && !lastName && !phoneNumber && !address) {
            res.status(400).json({ error: 'No fields to update' });
            return;
        }

        const updatedUser = await authService.updateProfile(req.user?.id as string, {
            firstName,
            lastName,
            phoneNumber,
            address
        });

        res.status(200).json(updatedUser);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await authService.getUserProfile(req.user?.id as string);
        res.status(200).json(user);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};
