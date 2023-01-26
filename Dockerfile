FROM node:14.7-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "yarn", "start" ]