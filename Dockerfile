##############
# A dockerfile to run the Ibotta anagrams app.
##############

FROM node:latest

# Create app directory
RUN mkdir -p /usr/bin/app
WORKDIR /usr/bin/app

# Install app dependencies
COPY package.json /usr/bin/app
RUN npm install

# Bundle app source
COPY . /usr/bin/app

EXPOSE 3001

CMD [ "npm", "start" ]
