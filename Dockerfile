FROM node:latest

RUN mkdir /src

RUN npm install nodemon -g

WORKDIR /src
COPY . /src
RUN npm install

EXPOSE 7000

CMD npm start
