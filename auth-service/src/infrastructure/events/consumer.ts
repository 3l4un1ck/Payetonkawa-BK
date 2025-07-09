import amqp from 'amqplib';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ?? 'supersecret';

export async function startAuthConsumer() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL ?? 'amqp://admin:admin@localhost:5672');
    const channel = await connection.createChannel();

    await channel.assertExchange('auth', 'fanout', { durable: false });
    const q = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(q.queue, 'auth', '');

    console.log('[Auth Service] Awaiting verification requests...');

    await channel.consume(q.queue, async (msg) => {
        if (!msg) return;

        const {type, token} = JSON.parse(msg.content.toString());
        const replyTo = msg.properties.replyTo;
        const correlationId = msg.properties.correlationId;

        if (type === 'verify_token' && replyTo && correlationId) {
            let response: any = {valid: false};

            try {
                const decoded = jwt.verify(token.replace(/^Bearer\s/, ''), JWT_SECRET) as any;
                response = {
                    valid: true,
                    userId: decoded.id,
                    email: decoded.email,
                };
            }  catch (err) {
                console.error('[Auth Service] Invalid token', err);
                response = {
                    valid: false,
                    error: err instanceof Error ? err.message : 'Unknown error'
                };
            }

            channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(response)), {
                correlationId,
            });
        }

        channel.ack(msg);
    });

    await channel.assertQueue('auth_check_queue', { durable: false });
    await channel.consume('auth_check_queue', async (msg) => {
        const { token } = JSON.parse(msg?.content?.toString() || "{}");
        let valid = false;
        let user = null;
        try {
            console.log(token);
            user = jwt.verify(token.replace(/^Bearer\s/, ''), JWT_SECRET) as any;
            valid = true;
        } catch (e) {
            valid = false;
        }
        const response = {
            type: "AUTH_CHECK_RESULT",
            valid,
            user
        };

        if (msg && msg.properties.replyTo && msg.properties.correlationId) {
            channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(JSON.stringify(response)),
                { correlationId: msg.properties.correlationId }
            );
        }
        if (msg) {
            channel.ack(msg);
        }
    });
}
