# Cryptopay Payment Gateway demo

This projects demostates integration with Cryptopay Payment Gateway.
You can check documentation [here](https://developers.cryptopay.band/gateway/gateway-overview).

## Quick start via Docker

1. Login into [Merchant's Dashboard Web Application](https://developers.cryptopay.band/#environments) and register(create) your own Gate (Setup -> Gate). Grab settings: `API URL`, `API Passphase`, `API Secret` and `Widget URL`
1. Start demo container by following command:
	```bash
	export GATE_API_URL=... # Like https://sandbox.cryptopay.band/v2/gate/
	export GATE_API_GATEWAY_ID=... # Like xxxxxxxx-xxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
	export GATE_API_PASSPHRASE=...
	export GATE_API_SECRET=...
	export GATE_WIDGET_URL=... # Like https://sandbox.cryptopay.band/
	export BASE_PATH=... # Optional
	docker run --rm --interactive --tty --publish 8080:8080 --env GATE_API_URL --env GATE_API_GATEWAY_ID --env GATE_API_PASSPHRASE --env GATE_API_SECRET --env GATE_WIDGET_URL --env BASE_PATH cexiolabs/cryptopay.demo
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

	export GATE_API_URL=https://gate-evolution-cryptopay.dev.kube/v2/gate
	export GATE_API_GATEWAY_ID=09635610-6109-4179-833b-8675fa709d9b
	export GATE_API_PASSPHRASE=d0d1ff7262d36b55704c7985e47d7aa0
	export GATE_API_SECRET=9wUo+LRIukjefUUVs641O9DOzCl9sjnnPMa3sUGj+NMSTEzhcrUnB3fp2X5G49sCfV9eMAoyzR8fCoRU5nmUag==
	export GATE_WIDGET_URL=https://gate-evolution-cryptopay.dev.kube/widget
	export GATE_WIDGET_URL=http://localhost:3000/widget/
	export BASE_PATH=

