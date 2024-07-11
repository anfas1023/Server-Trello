FROM node:alpine3.18
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . . 
EXPOSE 4000   

# ENV

ENV MONGO_URL="mongodb+srv://anfasmuhammed936:anfasmuhammed8590@cluster0.6hcxbof.mongodb.net/"
ENV APP_KEY="bblb rymg relu gtax"
ENV GOOGLE_CLIENT_ID="595057220047-km2nier9h3400o0qlana9n8ael9ngsk8.apps.googleusercontent.com"
ENV GOOGLE_CLIENT_SECRET="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"
ENV GITHUB_CLIENT_ID="Ov23ctqzed3uPPb06cRU"
ENV GITHUB_CLIENT_SECRET="4658dd9aaac31282cf10d8e2aef6523eb79d78ca"
ENV JWT_KEY="djhfasddfvfefv"
ENV JWT_REFRESHKEY="jdfhjdfjfd"
ENV BACKEND_URL="http://localhost:5000"
ENV FRONTEND_URL="http://localhost:3000"
ENV PORT=5000
ENV S3_ACCESS_KEY="AKIAXXWC5Z5CNLX5GD4P"
ENV S3_SECRET_KEY="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"
ENV REGION="ap-southeast-2"

CMD ["npm","run","dev"]


