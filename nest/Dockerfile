# Dockerfile for NestJS development
FROM node:20-alpine

# Install dependencies for native builds (if needed)
RUN apk add --no-cache bash

WORKDIR /app

# Copy only package files for caching
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application
COPY . .

# Expose the port NestJS runs on
EXPOSE 3001

# Default command (overridden by docker-compose)
CMD ["yarn", "start:dev"]
