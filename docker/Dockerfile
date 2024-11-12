FROM node:latest

# Create app directory
WORKDIR /usr/src/app

COPY web-server ./

RUN npm install

EXPOSE 4000

CMD ["node", "server.js"]