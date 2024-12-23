FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

COPY .env /app/.env

EXPOSE ${PORT}

CMD ["node", "run", "dev"]
