FROM nikolaik/python-nodejs:python3.7-nodejs12-slim
ENV NODE_ENV=production
RUN mkdir -p /opt/app1
#RUN apt update && apt install python3-pip -y
#RUN pip3 install boto3
#RUN pip3 install python-terraform
#RUN pip install mysql-connector-python
WORKDIR /opt/app1
# WORKDIR /opt/app1 --> /home/jenkins/vcp-data/vcp-repos/branches/main/node-express mapped in ecs task definition
COPY . ./
RUN npm i --only=production
RUN ls node_modules -la
RUN npm i -g nodemon
EXPOSE 8029
CMD ["nodemon", "app.js"]
