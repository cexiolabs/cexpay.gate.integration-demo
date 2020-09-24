#!/usr/bin/env node

// Necessary modules
const express = require('express');

const { createRequestHandler } = require('../lib/index');

// Read configuration
const GATE_API_URL = new URL(process.env.GATE_API_URL);
const GATE_WIDGET_URL = new URL(process.env.GATE_WIDGET_URL);
const GATE_API_PASSPHRASE = process.env.GATE_API_PASSPHRASE;
const GATE_API_SECRET = process.env.GATE_API_SECRET;
const BASE_PATH = process.env.BASE_PATH || "/";

const port = 8080;
const secret = GATE_API_SECRET !== undefined ? Buffer.from(GATE_API_SECRET, "base64") : null;

// Define Express Applcation https://expressjs.com/en/starter/hello-world.html
const app = express();

const requestHandler = createRequestHandler({
	basePath: BASE_PATH,
	apiUrl: GATE_API_URL,
	widgetUrl: GATE_WIDGET_URL,
	passphrase: GATE_API_PASSPHRASE,
	secret
});

app.use(requestHandler);

// Redirect
if (BASE_PATH !== '/') {
	app.get('/', (_, res) => res.redirect(BASE_PATH));
}

// Listen
app.listen(port, '0.0.0.0', () => {
	console.log(`Demo service is listening at http://0.0.0.0:${port}${BASE_PATH}`);
	console.log();
	console.log(`GATE_API_URL: ${GATE_API_URL}`);
	console.log(`GATE_WIDGET_URL: ${GATE_WIDGET_URL}`);
	console.log();
});

process.on("SIGBREAK", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
