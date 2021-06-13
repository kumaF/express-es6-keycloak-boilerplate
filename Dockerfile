FROM node:14-alpine

ENV NODE_ENV staging

WORKDIR /usr/src/app

ENV DEPENDENCY_VERSION=v0.1

COPY package*.json ./

RUN npm install --only=production

ENV CODE_VERSION=v0.1

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
