# Use official Node.js image to build and serve
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production image
FROM node:18-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]