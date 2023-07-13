FROM node:18-alpine
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY scripts ./scripts
RUN ls -la
COPY package.json ./
RUN npm i --only=production
RUN npm i -g nodemon
WORKDIR /opt/app/scripts
RUN ls -la
EXPOSE 5010
CMD ["nodemon", "server.js"]
