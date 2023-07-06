FROM node
WORKDIR /root/
COPY . .
RUN npm i
CMD node .