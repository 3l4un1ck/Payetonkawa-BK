export interface IUser {
    id: string;
    email: string;
    password?: string; // Optional for security reasons
    firstName: string;
    lastName: string;
    phoneNumber?: string; // Optional field
    isActive?: boolean;
    isEmailVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    roles?: string[]; // Array of role names
    address?: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        isDefault?: boolean; // Optional field
    };
}