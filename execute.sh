#!/bin/bash

# This script is used to execute my docker container with the necessary environment variables.

# Check if .env exists, if not, create it with example content
if [ ! -f .env ]; then
  echo "RABBITMQ_DEFAULT_USER=admin" > .env
  echo "RABBITMQ_DEFAULT_PASS=admin" >> .env
  echo "MONGO_INITDB_ROOT_USERNAME=payetonkawa" >> .env
  echo "MONGO_INITDB_ROOT_PASSWORD=Abcd@1234" >> .env
  echo "ME_CONFIG_MONGODB_ADMINUSERNAME=payetonkawa" >> .env
  echo "ME_CONFIG_MONGODB_ADMINPASSWORD=Abcd@1234" >> .env
  echo "RABBITMQ_URL=amqp://rabbitmq" >> .env
  echo "MONGO_URI=mongodb://mongo:27017/auth-db" >> .env
  echo "JWT_SECRET=supersecret" >> .env
  echo ".env file created with default values."
fi

# Export environment variables from .env
export $(grep -v '^#' .env | xargs)

# Run the Docker container using docker-compose
docker-compose up -d --build