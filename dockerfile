# ----------- Step 1: Build the NestJS app -----------
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app (including tsconfig and .env)
COPY . .

# Build the NestJS app (compiles TypeScript to JavaScript)
RUN npm run build


# ----------- Step 2: Create a lightweight image to run the app -----------
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/.env ./      

# Set environment variables (optional)
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Run the compiled app
CMD ["node", "dist/main.js"]
