# Cryptopay Payment Gateway demo

This projects demostates integration with Cryptopay Payment Gateway.
You can check documentation [here](https://developers.cryptopay.band/gateway/gateway-overview).

## Quick start via Docker

1. Login into [Merchant's Dashboard Web Application](https://developers.cryptopay.band/#environments) and register(create) your own Gate (Setup -> Gate). Grab settings: `API URL`, `API Passphase`, `API Secret` and `Widget URL`
1. Start demo container by following command:
	```bash
	export GATE_ID=...          # Like xxxxxxxx-xxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
	export GATE_PASSPHRASE=...
	export GATE_SECRET=...
	export GATE_URL=...         # Optional (default: https://sandbox.cryptopay.band/widget/)
	docker run --rm --interactive --tty --publish 8080:8080 --env GATE_ID --env GATE_PASSPHRASE --env GATE_SECRET --env GATE_URL cexiolabs/cryptopay.demo
	```
1. Open the following address in your browser: http://localhost:8080

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
