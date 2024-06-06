FROM node:20-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm install -g npm@latest

RUN npm install

COPY . .

EXPOSE 2405

CMD ["npm", "run", "dev"]