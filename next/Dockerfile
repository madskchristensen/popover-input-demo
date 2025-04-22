# Dockerfile for Next.js development
FROM node:20-alpine

# Install dependencies for native builds (if needed)
RUN apk add --no-cache bash

WORKDIR /app

# Copy only package files for caching
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Default command (overridden by docker-compose)
CMD ["yarn", "dev"]
