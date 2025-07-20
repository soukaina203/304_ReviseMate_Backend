# Step 1: Use Node.js as base image
FROM node:20-alpine AS build

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Build the NestJS application
RUN npm run build

# Step 2: Use a smaller image for running the app
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy the built app and node_modules from the previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Set environment variables (optional)
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
