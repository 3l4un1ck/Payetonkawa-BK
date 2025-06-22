import amqplib from "amqplib";

export class EventPublisher {
    private static channel: amqplib.Channel;

    static async connect() {
        const conn = await amqplib.connect(process.env.RABBITMQ_URL || "amqp://localhost");
        EventPublisher.channel = await conn.createChannel();
    }

    static async publish(queue: string, message: object) {
        await EventPublisher.channel.assertQueue(queue, { durable: true });
        EventPublisher.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });
    }
}
