import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { AppDataSource } from "./config/database";
import authRoutes from "./interfaces/routes/auth.routes";
import {EventPublisher} from "./infrastructure/events/publisher";
import docsRoutes from "./interfaces/routes/docs.routes";
import { startAuthConsumer } from "./infrastructure/events/consumer";
import client from "prom-client";

dotenv.config();

const app = express();
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(express.json());
app.use("/auth", authRoutes);

// Documentation routes
app.use('/', docsRoutes);

// Initialisation du registre Prometheus
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Endpoint /metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = process.env.PORT ?? 3000;

AppDataSource.initialize()
    .then(async () => {
        await EventPublisher.connect();
        app.listen(PORT, () => {
            console.log(`RabbitMQ connected successfully`);
            startAuthConsumer();
            console.log(`Auth Service running on port ${PORT}`)
        });
    })
    .catch((err) => console.error("DB connection error", err));
