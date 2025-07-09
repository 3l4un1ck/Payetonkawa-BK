import pika
import uuid
import json
import os

RABBITMQ_URL = os.environ.get("RABBITMQ_URL", "amqp://admin:admin@rabbitmq:5672")

def check_auth_token(token, timeout=5):
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()

    result = channel.queue_declare(queue='', exclusive=True)
    callback_queue = result.method.queue

    corr_id = str(uuid.uuid4())
    response = None

    def on_response(ch, method, props, body):
        nonlocal response
        if props.correlation_id == corr_id:
            response = json.loads(body)
            ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(
        queue=callback_queue,
        on_message_callback=on_response,
        auto_ack=False
    )

    request = {
        "type": "AUTH_CHECK",
        "token": token
    }

    channel.queue_declare(queue='auth_check_queue', durable=False)
    channel.basic_publish(
        exchange='',
        routing_key='auth_check_queue',
        properties=pika.BasicProperties(
            reply_to=callback_queue,
            correlation_id=corr_id,
        ),
        body=json.dumps(request)
    )

    # Attendre la réponse (avec timeout)
    import time
    start = time.time()
    while response is None and (time.time() - start) < timeout:
        connection.process_data_events(time_limit=0.2)
    connection.close()
    if response is None:
        raise Exception("Auth service did not respond in time")
    return response