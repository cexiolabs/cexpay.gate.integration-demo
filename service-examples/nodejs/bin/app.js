#!/usr/bin/env node

// Necessary modules
require('dotenv').config();
const path = require('path');
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

// Read configuration
const gateApiUrl = new URL(process.env.GATE_API_URL);
const gateWidgetUrl = new URL(process.env.GATE_WIIDGET_URL);
const gateApiPassphrase = process.env.GATE_API_PASSPHRASE;

const port = 3000;

// Define Express Applcation https://expressjs.com/en/starter/hello-world.html
const app = express();
app.use(bodyParser.json());

async function makeRequest(currency, amount) {
	return new Promise((resolve, reject) => {
		const reqData = JSON.stringify({
			"instrument": "CRYPTO_SELL",
			"model": "DEFAULT",
			"to": {
				currency,
				amount,
			}
		});
	
		const options = {
			host: gateApiUrl.host,
			port: '443',
			path: gateApiUrl.pathname,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'CP-ACCESS-PASSPHRASE': gateApiPassphrase,
				'Content-Length': reqData.length,
			}
		}

		const req = https.request(options, (res) => {
			if (res.statusCode >= 300) {
				reject(`Request error, status code: ${res.statusCode}`);
				return;
			}
			let response = '';
			res.on('data', (chuck) => {
				response += chuck;
			});
			res.on('end', () => {
				resolve(JSON.parse(response));
			})
		}).on('error', (error) => {
			reject(error);
			return;
		});

		req.write(reqData);
		req.end();
	});	
}

app.post('/api', async (req, res) => {
	const { currency, amount } = req.body;

	if (!currency || !amount) {
		res.end(JSON.stringify({
			error: 'Bad request.',
		}));
	}

	try {
		const order = await makeRequest(currency, amount);
		const paymentURL = `${gateWidgetUrl.toString()}/${order.id}`;
		res.end(JSON.stringify({ paymentURL }));
	} catch (error) {
		res.end(JSON.stringify({
			error: 'Service unavailable.',
		}));
	}
});


// Render demo UI
app.use(express.static(path.normalize(path.join(__dirname, "..", "..", "..", "ui"))));


app.listen(port, () => {
	console.log(`Demo app listening at http://localhost:${port}`);
});