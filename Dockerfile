FROM node:alpine3.18
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . . 
EXPOSE 4000

# ENV

ENV PORT=5000
ENV MONGO_URL= mongodb+srv://anfasmuhammed936:anfasmuhammed8590@cluster0.6hcxbof.mongodb.net/
ENV APP_KEY=bblb rymg relu gtax


CMD ["npm","run","dev"]

