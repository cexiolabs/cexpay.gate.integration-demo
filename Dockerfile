FROM node:14-alpine AS Builder
WORKDIR /build/usr/local/cryptopay-demo

# Coping necessary artifacts
COPY service/nodejs/bin/ service/nodejs/bin/
COPY service/nodejs/package.json service/nodejs/
COPY service/nodejs/package-lock.json service/nodejs/
COPY ui/ ui/

# Install application modules
RUN cd service/nodejs/ && npm install --production

# Clean up
RUN rm service/nodejs/package-lock.json


# Make final image
FROM node:14-alpine
COPY --from=Builder /build/ /
WORKDIR /usr/local/cryptopay-demo
EXPOSE 8080
ENV GATE_API_URL=
ENV GATE_API_PASSPHRASE=
ENV GATE_API_SECRET=
ENV GATE_WIDGET_URL=
ENV BASE_PATH=
ENTRYPOINT [ "/usr/local/cryptopay-demo/service/nodejs/bin/app.js"]