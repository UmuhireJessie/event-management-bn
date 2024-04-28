FROM node:16-alpine

WORKDIR /usr/src/app
COPY package*.json ./
ENV NODE_ENV=production
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 9010
RUN npm run build
CMD [ "npm", "run", "start" ]