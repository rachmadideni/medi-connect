FROM node:20 AS build
WORKDIR /app
COPY package.json ./
RUN npm install --include=optional && \
    npm install @tailwindcss/oxide-linux-x64-gnu --no-save
COPY . .
RUN npm run build

FROM node:18-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]