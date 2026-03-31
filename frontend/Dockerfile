# Use official Node.js image to build and serve

# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production image

# Production stage
FROM node:18-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]