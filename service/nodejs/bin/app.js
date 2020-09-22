#!/usr/bin/env node

// Necessary modules
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const express = require('express');
const path = require('path');

// Read configuration
const GATE_API_URL = new URL(process.env.GATE_API_URL);
const GATE_WIDGET_URL = new URL(process.env.GATE_WIDGET_URL);
const GATE_API_PASSPHRASE = process.env.GATE_API_PASSPHRASE;
const GATE_API_SECRET = process.env.GATE_API_SECRET;

const port = 8080;

// Define Express Applcation https://expressjs.com/en/starter/hello-world.html
const app = express();
app.use(bodyParser.json());

app.post('/api', async (req, res) => {
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

		// TODO: Show how to calculate signature using GATE_API_SECRET
		//

		const requestHeaders = {
			'Content-Type': 'application/json',
			'CP-ACCESS-PASSPHRASE': GATE_API_PASSPHRASE,
			//'CP-ACCESS-CALLBACK-SIGN': signature,
			'Content-Length': requestRawBody.length
		};

		const response = await fetch(GATE_API_URL, {
			method: 'POST',
			body: requestRawBody,
			headers: requestHeaders
		}).then(function checkStatus(fetchResponse) {
			if (fetchResponse.ok) { // fetchResponse.status >= 200 && fetchResponse.status < 300
				return fetchResponse;
			} else {
				if(fetchResponse.status === 401) { throw new Error('Unauthorized. Check GATE_API_PASSPHRASE/GATE_API_SECRET value.'); }
				throw new Error(`${fetchResponse.status} ${fetchResponse.statusText}`);
			}
		});

		const order = await response.json();

		let widgetBaseUrlStr = GATE_WIDGET_URL.toString();
		if (!widgetBaseUrlStr.endsWith('/')) { widgetBaseUrlStr = widgetBaseUrlStr + '/'; }
		const paymentURL = new URL(`${widgetBaseUrlStr}${order.id}`);

		res.status(201).end(JSON.stringify({ paymentURL }));

		console.log(`Got request for new order ${amount} ${currency}. Payment URL is ${paymentURL}`);

	} catch (error) {
		res.status(500).end(JSON.stringify({ error: 'Underlaying service error: ' + error.message, }));
		console.error(error);
	}
});


// Render demo UI
app.use(express.static(path.normalize(path.join(__dirname, "..", "..", "..", "ui"))));

// Listen
app.listen(port, '0.0.0.0', () => {
	console.log(`Demo service is listening at http://0.0.0.0:${port}`);
	console.log();
	console.log(`GATE_API_URL: ${GATE_API_URL}`);
	console.log(`GATE_WIDGET_URL: ${GATE_WIDGET_URL}`);
	console.log();
});

process.on("SIGBREAK", () => process.exit(1));
process.on("SIGINT", () => process.exit(1));
