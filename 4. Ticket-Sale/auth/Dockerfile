FROM node:alpine

ENV CI=true
ENV WDS_SOCKET_PORT=0

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY ./ ./

CMD ["npm", "run", "start"]