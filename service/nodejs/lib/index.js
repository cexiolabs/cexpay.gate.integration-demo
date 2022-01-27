// Necessary modules
const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const https = require('https');
const path = require('path');


function createRequestHandler({ apiOrigin, id, passphrase, secret, caCertFile }) {
	const agentOpts = {};
	if(caCertFile) {
		if(!fs.existsSync(caCertFile)) {
			throw new Error(`The provided CA certificate file '${caCertFile}' does not exist.`);
		}
		agentOpts.ca = fs.readFileSync(caFile, "utf-8");
	}
	const requestAgent = new https.Agent(Object.freeze(agentOpts));

	const router = express.Router();

	const apiUrl = new URL(apiOrigin); // clone
	apiUrl.pathname = path.join('/v3/gate', encodeURI(id));

	router.use("/api", bodyParser.json());

	router.post("/api", async (req, res) => {
		try {
			const { currency, amount } = req.body;
			// TODO some validation for currency and amount.

			const requestBody = {
				"id": "cpo" + Date.now(),
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
				headers: requestHeaders,
				agent: requestAgent
			});

			if (!fetchResponse.ok) { // fetchResponse.status >= 200 && fetchResponse.status < 300
				if (fetchResponse.status === 401) { throw new Error('Unauthorized. Check API passphrase/secret value.'); }
				throw new Error(`${fetchResponse.status} ${fetchResponse.statusText}`);
			}

			console.log(fetchResponse);

			let order;
			try {
				order = await fetchResponse.json();
			} catch (e) {
				const textData = await fetchResponse.text();
				console.error(textData);
				throw e;
			}

			res.status(201).end(JSON.stringify({ orderId: order.id }));

			console.log(`Got request for new order ${amount} ${currency}. OrderId is '${order.id}'.`);

		} catch (error) {
			console.error(error);
			const errMessage = 'Underlying service error: ' + error.message;
			res.writeHead(500).end(JSON.stringify({ error: errMessage }));
		}
	});

	// Render demo UI
	// Static files
	router.use("/", express.static(path.normalize(path.join(__dirname, "..", "..", "..", "ui"))));


	return router;
}

module.exports = {
	createRequestHandler,
	default: createRequestHandler
};
