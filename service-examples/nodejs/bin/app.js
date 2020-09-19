#!/usr/bin/env node

const path = require('path');
const express = require('express');

const app = express();
const port = 3000;


app.get('/api', (req, res) => {
	// TODO Interact with CryptoPay Gateway
	res.send('Hello World API!');
})


// Render demo UI
app.use(express.static(path.normalize(path.join(__dirname, "..", "..", "..", "ui"))));


app.listen(port, () => {
	console.log(`Demo app listening at http://localhost:${port}`);
})