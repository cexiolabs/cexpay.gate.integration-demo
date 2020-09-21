FROM node:12-alpine AS Builder
WORKDIR /build/usr/src/app
COPY . .
WORKDIR /build/usr/src/app/service-examples/nodejs
RUN npm install express body-parser

FROM node:12-alpine
COPY --from=Builder /build/ /
WORKDIR /usr/src/app/service-examples/nodejs
EXPOSE 8080
ENTRYPOINT [ "bin/app.js"]