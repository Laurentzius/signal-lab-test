FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY apps/backend/package*.json ./
RUN npm install

COPY apps/backend/ ./
COPY prisma/ ./prisma/

RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3001

CMD ["sh", "-c", "npx prisma generate --schema=./prisma/schema.prisma && npx prisma migrate deploy --schema=./prisma/schema.prisma && npm run start:dev"]
