FROM node:20 AS build
WORKDIR /app
COPY package.json ./
RUN npm install --include=optional && \
    npm install @tailwindcss/oxide-linux-x64-gnu --no-save
COPY . .

# Declare and use build arg
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM node:18-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]