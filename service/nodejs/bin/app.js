#!/usr/bin/env node

// Necessary modules
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fetch = require('node-fetch');
const express = require('express');
const path = require('path');

// Read configuration
const GATE_API_URL = new URL(process.env.GATE_API_URL);
const GATE_WIDGET_URL = new URL(process.env.GATE_WIDGET_URL);
const GATE_API_PASSPHRASE = process.env.GATE_API_PASSPHRASE;
const GATE_API_SECRET = process.env.GATE_API_SECRET;
const BASE_PATH = process.env.BASE_PATH || "/";

const port = 8080;
const secret = GATE_API_SECRET !== undefined ? Buffer.from(GATE_API_SECRET, "base64") : null;

// Some validatetion
if (!/^(\/[A-Za-z0-9\-]+)?\/$/.test(BASE_PATH)) {
	console.error(`Bad value of BASE_PATH: ${BASE_PATH}`);
	process.exit(1);
}

// Define Express Applcation https://expressjs.com/en/starter/hello-world.html
const app = express();
app.use(BASE_PATH, bodyParser.json());

app.post(`${BASE_PATH}api`, async (req, res) => {
	try {
		const { currency, amount } = req.body;
		// TODO some validation for currency and amount.

		const requestBody = {
			"instrument": "CRYPTO_SELL",
			"model": "DEFAULT",
			"to": {
				currency,
				amount,
			}
		};

		const requestRawBody = Buffer.from(JSON.stringify(requestBody), 'utf-8');

		// Prepare headers
		const requestHeaders = {
			'Content-Type': 'application/json',
			'CP-ACCESS-PASSPHRASE': GATE_API_PASSPHRASE,
			'Content-Length': requestRawBody.length
		};

		if (secret !== null) {
			// Signature calculator

			const timestamp = (Date.now() / 1000).toString();

			const friendlyTimestamp = Buffer.from(timestamp);
			const friendlyMethod = Buffer.from('POST');
			const friendlyUrlPath = Buffer.from(GATE_API_URL.pathname);

			const what = Buffer.concat([friendlyTimestamp, friendlyMethod, friendlyUrlPath, requestRawBody]);

			const hmac = crypto.createHmac("sha256", secret).update(what);
			const signature = hmac.digest().toString("base64");

			requestHeaders['CP-ACCESS-TIMESTAMP'] = timestamp;
			requestHeaders['CP-ACCESS-SIGN'] = signature;
		}

		const fetchResponse = await fetch(GATE_API_URL, {
			method: 'POST',
			body: requestRawBody,
			headers: requestHeaders
		});

		if (!fetchResponse.ok) { // fetchResponse.status >= 200 && fetchResponse.status < 300
			if (fetchResponse.status === 401) { throw new Error('Unauthorized. Check GATE_API_PASSPHRASE/GATE_API_SECRET value.'); }
			throw new Error(`${fetchResponse.status} ${fetchResponse.statusText}`);
		}

		const order = await fetchResponse.json();

		let widgetBaseUrlStr = GATE_WIDGET_URL.toString();
		if (!widgetBaseUrlStr.endsWith('/')) { widgetBaseUrlStr = widgetBaseUrlStr + '/'; }
		const paymentURL = new URL(`${widgetBaseUrlStr}${order.id}`);

		res.status(201).end(JSON.stringify({ paymentURL }));

		console.log(`Got request for new order ${amount} ${currency}. Payment URL is ${paymentURL}`);

	} catch (error) {
		const errMessage = 'Underlaying service error: ' + error.message;
		res.writeHead(500, errMessage).end(JSON.stringify({ error: errMessage }));
		console.error(error);
	}
});


// Render demo UI
app.use(BASE_PATH, express.static(path.normalize(path.join(__dirname, "..", "..", "..", "ui"))));

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
