# CEX Pay Payment Gateway demo

This projects demostates integration with CEX Pay Payment Gateway.
You can check documentation [here](https://developers.cexpay.io/gateway/gateway-overview/).

## Quick start via Docker

1. Login into [Merchant's Dashboard Web Application](https://developers.cexpay.io/gateway/gateway-management/) and register (create) your own Gateway. Grab settings: `API URL`, `API Passphase`, `API Secret` and `Widget URL`
2. Start demo container by following command:
	```bash
	export GATE_ID=...          # Like a65f7fe6-ad2a-4fbe-9f2b-b939db70733c
	export GATE_PASSPHRASE=...
	export GATE_SECRET=...
	export GATE_URL=...         # Optional (local: http://127.0.0.1:38091)
	docker run --rm --interactive --tty --publish 8080:8080 --env GATE_ID --env GATE_PASSPHRASE --env GATE_SECRET --env GATE_URL cexiolabs/cexpay.gate.integration-demo
	```
3. Open the following address in your browser: http://localhost:8080

## Dev notes

### How to start
```bash
git clone https://github.com/cexiolabs/cexpay.gate.integration-demo.git
```

Then open VS Code, copy `.env-example` file into `.env` and set passphrase/secret there (+ optionally override gateway uuid and gate back-end url).

Now you can launch and debug app via VS Code configuration.

### How to build Docker image
```bash
docker build --tag cexiolabs/cexpay.gate.integration-demo .
```
