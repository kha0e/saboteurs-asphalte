# Server Dockerfile for SDA
FROM node:18-alpine
WORKDIR /app
COPY server/package.json server/package-lock.json* ./
RUN npm install
COPY server ./
RUN npm run build
EXPOSE 2567
CMD ["npm", "start"]