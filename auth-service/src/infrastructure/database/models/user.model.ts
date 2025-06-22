import { Entity, ObjectIdColumn, Column } from "typeorm";
import {IAddress} from "../../../domain/types/address";
import {ObjectId} from "mongodb";

@Entity()
export class User {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    phoneNumber!: string;

    @Column()
    isActive!: boolean;

    @Column()
    createdAt!: Date;

    @Column()
    lastLoginAt?: Date;

    @Column(type => Address)
    shippingAddresses!: IAddress[];

    @Column(type => Address)
    billingAddress!: IAddress;

    @Column()
    preferredCurrency?: string;

    @Column()
    marketingConsent?: boolean;
}

@Entity()
class Address implements IAddress {
    @Column()
    street!: string;

    @Column()
    city!: string;

    @Column()
    state!: string;

    @Column()
    country!: string;

    @Column()
    postalCode!: string;

    @Column()
    isDefault?: boolean;
}