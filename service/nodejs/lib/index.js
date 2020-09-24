// Necessary modules
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fetch = require('node-fetch');
const express = require('express');
const path = require('path');

function createRequestHandler({ basePath, apiUrl, widgetUrl, passphrase, secret }) {
	const router = express.Router();

	// Some validatetion
	if (!/^(\/[A-Za-z0-9\-]+)?\/$/.test(basePath)) {
		throw new Error(`Bad value of basePath: ${basePath}`);
	}

	router.use(basePath, bodyParser.json());

	router.post(`${basePath}api`, async (req, res) => {
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
				'CP-ACCESS-PASSPHRASE': passphrase,
				'Content-Length': requestRawBody.length
			};

			if (secret !== null) {
				// Signature calculator

				const timestamp = (Date.now() / 1000).toString();

				const friendlyTimestamp = Buffer.from(timestamp);
				const friendlyMethod = Buffer.from('POST');
				const friendlyUrlPath = Buffer.from(apiUrl.pathname);

				const what = Buffer.concat([friendlyTimestamp, friendlyMethod, friendlyUrlPath, requestRawBody]);

				const hmac = crypto.createHmac("sha256", secret).update(what);
				const signature = hmac.digest().toString("base64");

				requestHeaders['CP-ACCESS-TIMESTAMP'] = timestamp;
				requestHeaders['CP-ACCESS-SIGN'] = signature;
			}

			const fetchResponse = await fetch(apiUrl, {
				method: 'POST',
				body: requestRawBody,
				headers: requestHeaders
			});

			if (!fetchResponse.ok) { // fetchResponse.status >= 200 && fetchResponse.status < 300
				if (fetchResponse.status === 401) { throw new Error('Unauthorized. Check API passphrase/secret value.'); }
				throw new Error(`${fetchResponse.status} ${fetchResponse.statusText}`);
			}

			const order = await fetchResponse.json();

			let widgetBaseUrlStr = widgetUrl.toString();
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
	router.use(basePath, express.static(path.normalize(path.join(__dirname, "..", "..", "..", "ui"))));

	return router;
}

module.exports = {
	createRequestHandler,
	default: createRequestHandler
};