FROM node:20.9.0-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn 

COPY . .

ENV HOST 0.0.0.0
ENV PORT=3000

EXPOSE 3000

RUN yarn prisma generate

ARG ENV_VALUE=PROD
ENV ENVIRONMENT=$ENV_VALUE

RUN if [ "$ENVIRONMENT" = "PROD" ]; then \
        yarn build \
    fi

RUN chmod u+x run.sh



CMD [ "./run.sh" ]