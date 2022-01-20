ARG IMAGE=node:16-alpine
ARG BUILD_CONFIGURATION=release


FROM ${IMAGE} AS builder
WORKDIR /build/usr/local/cexpay-demo

# Coping necessary artifacts
COPY service/nodejs/bin/ service/nodejs/bin/
COPY service/nodejs/lib/ service/nodejs/lib/
COPY service/nodejs/package.json service/nodejs/
COPY service/nodejs/package-lock.json service/nodejs/
COPY ui/ ui/
COPY docker/docker-entrypoint.sh ./

# Install application modules
RUN cd service/nodejs/ && npm install --production

# Cleanup
RUN rm service/nodejs/package-lock.json


# Make final image
FROM ${IMAGE}
COPY --from=builder /build/ /
WORKDIR /usr/local/cexpay-demo
EXPOSE 8080
ENV GATE_URL=
ENV GATE_ID=
ENV GATE_PASSPHRASE=
ENV GATE_SECRET=
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
# BASE_PATH define web root path
ENV BASE_PATH=/
ENTRYPOINT [ "/usr/local/cexpay-demo/docker-entrypoint.sh" ]
