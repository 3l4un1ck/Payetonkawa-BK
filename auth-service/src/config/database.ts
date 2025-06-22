import { DataSource } from "typeorm";
import { User } from "../infrastructure/database/models/user.model";

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: process.env.MONGO_URI,
    synchronize: true,
    logging: false,
    entities: [User],
});
