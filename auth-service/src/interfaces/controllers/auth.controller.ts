import { Request, Response } from "express";
import {AuthService} from "../../application/auth.service";


const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address
        } = req.body;

        // Validate request body
        if (!email || !password || !firstName || !lastName || !phoneNumber || !address) {
            return res.status(400).json({
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
        }

        // Validate address object
        if (!address.street || !address.city || !address.state ||
            !address.country || !address.postalCode) {
            return res.status(400).json({
                error: 'Invalid address format',
                requiredAddressFields: [
                    'street',
                    'city',
                    'state',
                    'country',
                    'postalCode'
                ]
            });
        }

        const user = await authService.register(
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address
        );

        // Return success response without sensitive information
        res.status(201).json({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            shippingAddresses: user.shippingAddresses,
            createdAt: user.createdAt
        });

    } catch (err: any) {
        // Handle specific error cases
        if (err.message.includes('already exists')) {
            return res.status(409).json({ error: err.message });
        }
        if (err.message.includes('Invalid')) {
            return res.status(400).json({ error: err.message });
        }

        // Log unexpected errors but don't expose details to a client
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
