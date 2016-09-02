FROM node:latest

RUN mkdir /src

RUN npm install nodemon -g --production

WORKDIR /src
COPY . /src
RUN npm install --production

EXPOSE 7000

CMD npm start
