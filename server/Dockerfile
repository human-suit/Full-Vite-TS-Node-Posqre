FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g nodemon

COPY . .
COPY wait-for-it.sh .

EXPOSE 5000

CMD ["bash", "./wait-for-it.sh", "db:5432", "--", "npm", "run", "dev"]