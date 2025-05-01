# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci && npx update-browserslist-db@latest -y && rm -rf ./node_modules/.cache

COPY . .

# Runtime stage
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD ["npm", "run", "dev"]
