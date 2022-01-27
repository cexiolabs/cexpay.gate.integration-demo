#!/usr/bin/env node

// Necessary modules
const express = require('express');

const { createRequestHandler } = require('../lib/index');

// Read configurations
const GATE_URL = new URL(process.env.GATE_URL);
const GATE_ID = process.env.GATE_ID;
const GATE_PASSPHRASE = process.env.GATE_PASSPHRASE;
const GATE_SECRET_BASE64 = process.env.GATE_SECRET;
const BASE_PATH = process.env.BASE_PATH || "/";
const GATE_CA_FILE = process.env.GATE_CA_FILE;
const GATE_API_ORIGIN = GATE_URL.origin;

if (!BASE_PATH.startsWith("/")) {
	console.error(`Bad BASE_PATH value '${BASE_PATH}'. It should starts from '/'.`)
	process.exit(1);
}

const PORT = 8080;
const GATE_SECRET = Buffer.from(GATE_SECRET_BASE64, "base64");

// Define Express Application https://expressjs.com/en/starter/hello-world.html
const app = express();

const requestHandler = createRequestHandler({
	apiOrigin: GATE_API_ORIGIN,
	id: GATE_ID,
	passphrase: GATE_PASSPHRASE,
	secret: GATE_SECRET,
	caCertFile: GATE_CA_FILE
});

app.use(BASE_PATH, requestHandler);

// Redirect
if (BASE_PATH !== '/') {
	app.get('/', (_, res) => res.redirect(BASE_PATH));
}

// Listen
app.listen(PORT, '0.0.0.0', () => {
	console.log(`Demo service is listening at http://localhost:${PORT}${BASE_PATH}`);
	console.log();
	console.log(`GATE_API_ORIGIN: ${GATE_API_ORIGIN}`);
	console.log(`GATE_ID: ${GATE_ID}`);
	console.log();
});

process.on("SIGBREAK", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
