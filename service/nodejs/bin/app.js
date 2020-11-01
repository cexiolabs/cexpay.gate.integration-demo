#!/usr/bin/env node

// Necessary modules
const express = require('express');

const { createRequestHandler } = require('../lib/index');

// Read configurations
const GATE_URL = new URL(process.env.GATE_URL);
const GATE_ID = process.env.GATE_ID;
const GATE_PASSPHRASE = process.env.GATE_PASSPHRASE;
const GATE_SECRET_BASE64 = process.env.GATE_SECRET;

const PORT = 8080;
const GATE_SECRET = Buffer.from(GATE_SECRET_BASE64, "base64");

// Define Express Application https://expressjs.com/en/starter/hello-world.html
const app = express();

const requestHandler = createRequestHandler({
	url: GATE_URL,
	id: GATE_ID,
	passphrase: GATE_PASSPHRASE,
	secret: GATE_SECRET
});

app.use(requestHandler);

// Redirect
if (GATE_URL.pathname !== '/') {
	app.get('/', (_, res) => res.redirect(GATE_URL.pathname));
}

// Listen
app.listen(PORT, '0.0.0.0', () => {
	console.log(`Demo service is listening at http://localhost:${PORT}${GATE_URL.pathname}`);
	console.log();
	console.log(`GATE_URL: ${GATE_URL}`);
	console.log(`GATE_ID: ${GATE_ID}`);
	console.log();
});

process.on("SIGBREAK", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
