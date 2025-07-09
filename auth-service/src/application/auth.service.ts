import { User } from "../infrastructure/database/models/user.model";
import { AppDataSource } from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { EventPublisher } from "../infrastructure/events/publisher";
import {IAddress} from "../domain/types/address";

export class AuthService {
    async register(
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        phoneNumber: string,
        billingAddress: IAddress
    ) {
        // Validate email format
        if (!RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).exec(email)) {
            throw new Error('Invalid email format');
        }

        // Validate password strength
        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        // Validate required fields
        if (!firstName || !lastName || !phoneNumber) {
            throw new Error('All fields are required');
        }

        // Validate a phone number format (basic example)
        if (!RegExp(/^\+?[\d\s-]{10,}$/).exec(phoneNumber)) {
            throw new Error('Invalid phone number format');
        }

        // Check if a user already exists
        const repo = AppDataSource.getMongoRepository(User);
        const existingUser = await repo.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = repo.create({
            email,
            password: hashed,
            firstName,
            lastName,
            phoneNumber,
            billingAddress,
            isActive: true,
            createdAt: new Date(),
            marketingConsent: false,
            preferredCurrency: 'USD'
        });

        await EventPublisher.publish("user.registered", {
            email: user.email,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName
        });

        return await repo.save(user);
    }

    async login(email: string, password: string) {
        try {
            const repo = AppDataSource.getMongoRepository(User);
            console.log(repo);
            const user = await repo.findOneBy({ email });
            console.log(user);
            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new Error("Invalid credentials");
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
            return { token };
        } catch (error) {
            console.error(error);
            throw new Error("Invalid credentials");
        }
    }

    async logout(token: string) {
        // For this example, we will just return a success message.
        return { message: "User logged out successfully" };
    }

    async updateProfile(userId: string, data: any) {
        const repo = AppDataSource.getMongoRepository(User);
        const user = await repo.findOneBy({ id: userId });
        if (!user) {
            throw new Error("User not found");
        }
        const updatedData: Partial<User> = {};
        if (data.firstName) updatedData.firstName = data.firstName;
        if (data.lastName) updatedData.lastName = data.lastName;
        if (data.phoneNumber) {
            // Validate a phone number format
            if (!RegExp(/^\+?[\d\s-]{10,}$/).exec(data.phoneNumber)) {
                throw new Error('Invalid phone number format');
            }
            updatedData.phoneNumber = data.phoneNumber;
        }
        if (data.billingAddress) {
            updatedData.billingAddress = data.billingAddress;
        }
        if (data.preferredCurrency) {
            updatedData.preferredCurrency = data.preferredCurrency;
        }
        if (data.marketingConsent !== undefined) {
            updatedData.marketingConsent = data.marketingConsent;
        }
        await repo.update(userId, updatedData);
        const updatedUser = await repo.findOneBy({ id: userId });
        if (!updatedUser) {
            throw new Error("User not found after update");
        }
        await EventPublisher.publish("user.profile.updated", {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phoneNumber: updatedUser.phoneNumber,
            billingAddress: updatedUser.billingAddress,
            preferredCurrency: updatedUser.preferredCurrency,
            marketingConsent: updatedUser.marketingConsent
        });
        return updatedUser;
    }

    async getUserProfile(userId: string) {
        const repo = AppDataSource.getMongoRepository(User);
        const user = await repo.findOneBy({id: userId});
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}
