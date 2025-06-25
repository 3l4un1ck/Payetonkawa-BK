import pika
import json
import os

def verify_token(request):
    token = request.headers.get("Authorization")
    if not token:
        return False

    try:
        # Envoi synchrone à auth-service via RabbitMQ (simplifié ici pour l'exemple)
        url = os.environ.get('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672')
        params = pika.URLParameters(url)
        connection = pika.BlockingConnection(params)
        channel = connection.channel()

        # Declare a direct queue for auth response (temp)
        result = channel.queue_declare('', exclusive=True)
        callback_queue = result.method.queue

        corr_id = str(os.urandom(16))

        response = {}

        def on_response(ch, method, props, body):
            if props.correlation_id == corr_id:
                response['data'] = json.loads(body)
                ch.stop_consuming()

        channel.basic_consume(
            queue=callback_queue,
            on_message_callback=on_response,
            auto_ack=True
        )

        payload = {
            "type": "verify_token",
            "token": token,
        }

        channel.basic_publish(
            exchange='auth',
            routing_key='',
            properties=pika.BasicProperties(
                reply_to=callback_queue,
                correlation_id=corr_id
            ),
            body=json.dumps(payload)
        )

        channel.start_consuming()
        return response.get('data', {}).get('valid', False)
    except Exception as e:
        print(f"[Middleware] Auth error: {e}")
        return False
