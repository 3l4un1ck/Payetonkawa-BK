#!/bin/bash

SERVICE=$1

if [ "$SERVICE" == "auth-service" ]; then
  docker-compose up -d rabbitmq mongo
  docker-compose up --build auth-service
else
  echo "Usage: ./execute.sh auth-service"
  exit 1
fi