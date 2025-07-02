# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Use distroless image for minimal runtime
FROM gcr.io/distroless/nodejs:18

WORKDIR /app

# Environment variable (if you need it at runtime)
ENV NODE_ENV=production

# Copy only required files to the final image
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port your app runs on
EXPOSE 3000

# Start the Next.js server
CMD ["node_modules/.bin/next", "start"]
