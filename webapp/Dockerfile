FROM node:16.20.2-alpine

WORKDIR /env

COPY ./.env /app

WORKDIR /app

COPY package*.json ./

RUN yarn 

COPY . .

ENV HOST 0.0.0.0
ENV PORT=3000

EXPOSE 3000

RUN yarn prisma generate

RUN yarn build

CMD [ "yarn", "start" ]