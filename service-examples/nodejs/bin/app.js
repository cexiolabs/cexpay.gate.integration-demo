#!/usr/bin/env node

// Read configuration
const gateApiUrl = new URL(process.env.GATE_API_URL);
const gateApiPassphrase = process.env.GATE_API_PASSPHRASE;
const gateWidgetUrl = new URL(process.env.GATE_WIIDGET_URL);
const port = 3000;

// Necessary modules
const path = require('path');
const express = require('express');


// Define Express Applcation https://expressjs.com/en/starter/hello-world.html
const app = express();

app.get('/api', (req, res) => {
	// TODO Interact with CryptoPay Gateway

	// Request order:
	//   POST ${gateApiUrl}/order
	//   Headers:
	//     "Content-type": "application/json"
	//     "CP-ACCESS-PASSPHRASE": "${gateApiPassphrase}"
	//   Body:
	//     {
	//       "instrument": "CRYPTO_SELL",
	//       "model": "DEFAULT",
	//       "to": {
	//         "currency": "USD",
	//         "amount": "20"
	//       }
	//     }
	//   Retreive OrderId


	// Format Widget URL:
	//  const paymentURL = ${gateWidgetUrl}/${orderId}

	res.send('Hello World API!');
});


// Render demo UI
app.use(express.static(path.normalize(path.join(__dirname, "..", "..", "..", "ui"))));


app.listen(port, () => {
	console.log(`Demo app listening at http://localhost:${port}`);
});