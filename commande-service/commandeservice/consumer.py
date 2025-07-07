# import pika
# import json
# import os
#
# def callback(ch, method, properties, body):
#     data = json.loads(body)
#     print("[Produit Service] Received event:", data)
#     # Ex: créer une fiche produit liée à l'utilisateur
#     if data.get('type') == 'user_created':
#         print(f"Créer un espace produit pour l'utilisateur {data['payload']['email']}")
#
# def start_consumer():
#     url = os.environ.get('RABBITMQ_URL', 'amqp://admin:admin@localhost:5672')
#     params = pika.URLParameters(url)
#     connection = pika.BlockingConnection(params)
#     channel = connection.channel()
#
#     channel.exchange_declare(exchange='user', exchange_type='fanout')
#     result = channel.queue_declare('', exclusive=True)
#     queue_name = result.method.queue
#
#     channel.queue_bind(exchange='user', queue=queue_name)
#     print('[Produit Service] Waiting for messages. To exit press CTRL+C')
#     channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
#     channel.start_consuming()