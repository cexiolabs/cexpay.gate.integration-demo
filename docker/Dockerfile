ARG IMAGE=node:16-alpine
ARG BUILD_CONFIGURATION=release


FROM ${IMAGE} AS builder
# Coping necessary artifacts
WORKDIR /build/usr/local/cexiolabs/cexpay.gate.integration-demo
COPY service/nodejs/bin/ service/nodejs/bin/
COPY service/nodejs/lib/ service/nodejs/lib/
COPY service/nodejs/package.json service/nodejs/
COPY service/nodejs/package-lock.json service/nodejs/
COPY ui/ ui/
# Install application modules
RUN cd service/nodejs/ && npm install --production
# Cleanup
RUN rm service/nodejs/package-lock.json
# Coping docker entrypoint script
WORKDIR /build/usr/local/bin
COPY docker/docker-entrypoint.sh ./


# Make final image
FROM ${IMAGE}
COPY --from=builder /build/ /
EXPOSE 8080
ENV GATE_URL=
ENV GATE_ID=
ENV GATE_PASSPHRASE=
ENV GATE_SECRET=
ENV GATE_CA_FILE=
# BASE_PATH define web root path
ENV BASE_PATH=/
ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]
