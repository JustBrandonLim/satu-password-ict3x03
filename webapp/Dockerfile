FROM node:16.20.2-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn 

COPY . .

COPY secrets/webapp/.env .env

CMD [ "ls -lah" ]

ENV HOST 0.0.0.0
ENV PORT=3000

EXPOSE 3000

RUN yarn prisma generate

RUN yarn build

CMD [ "yarn", "start" ]