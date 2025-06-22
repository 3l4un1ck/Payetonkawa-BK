import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import authRoutes from "./interfaces/routes/auth.routes";
import {EventPublisher} from "./infrastructure/events/publisher";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(async () => {

        await EventPublisher.connect();
        app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
    })
    .catch((err) => console.error("DB connection error", err));
