# Cryptopay Payment Gateway demo

This projects demostates integration with Cryptopay Payment Gateway.
You can check documentation [here](https://developers.cryptopay.band/gateway/gateway-overview).

## Quick start via Docker

1. Login into [Merchant's Dashboard Web Application](https://developers.cryptopay.band/#environments) and register(create) your own Gate (Setup -> Gate). Grab settings: `API URL`, `API Passphase`, `API Secret` and `Widget URL`
1. Start demo container by following command:
	```bash
	export GATE_API_URL=... # Like https://sandbox.cryptopay.band/v2/gate/xxxxxxxx-xxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
	export GATE_API_PASSPHRASE=...
	export GATE_API_SECRET=...
	export GATE_WIDGET_URL=... # Like https://sandbox.cryptopay.band/widget/xxxxxxxx-xxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
	docker run --rm --interactive --tty --publish 8080:8080 --env GATE_API_URL --env GATE_API_PASSPHRASE --env GATE_API_SECRET --env GATE_WIDGET_URL cexiolabs/cryptopay.demo
	```
1. Open the following address in your browser: http://127.0.0.1:8080

## Dev notes

### How to start
```bash
git clone <THIS REPO> cryptopay.demo.service
cd cryptopay.demo.service
git submodule update --init
cd service/nodejs
npm install
npm start
```

### How to build Docker image
```bash
docker build --tag cexiolabs/cryptopay.demo --file Dockerfile .
```
