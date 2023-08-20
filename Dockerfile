FROM node:18-alpine

WORKDIR /app

COPY . /app

RUN npm install --force

CMD ["npm", "run", "start:dev"]