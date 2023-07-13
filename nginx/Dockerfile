FROM nginx:alpine
RUN apk update && apk add --no-cache curl
COPY ./default.conf /etc/nginx/conf.d
