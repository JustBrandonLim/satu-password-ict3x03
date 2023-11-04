FROM node:20.9.0-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn 

COPY . .

ENV HOST 0.0.0.0
ENV PORT=3000

EXPOSE 3000

RUN yarn prisma generate

RUN yarn build

RUN chmod u+x run.sh

CMD [ "./run.sh" ]