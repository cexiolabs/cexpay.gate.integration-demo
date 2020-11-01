#!/bin/sh

set -e

if [ -z "$GATE_ID" ]; then
	echo "Error. Please define GATE_ID environment variable."
	exit 1
fi
if [ -z "$GATE_PASSPHRASE" ]; then
	echo "Error. Please define GATE_PASSPHRASE environment variable."
	exit 1
fi
if [ -z "$GATE_SECRET" ]; then
	echo "Error. Please define GATE_SECRET environment variable."
	exit 1
fi
if [ -z "$GATE_URL" ]; then
	export GATE_URL="https://sandbox.cryptopay.band/widget/"
	echo "Warning. A GATE_URL environment variable is not defined. Fallback to the SANDBOX environment."
	echo
	echo "You may choose one of the enviroments."
	echo "	PRODUCTION: https://gate.cryptopay.band/"
	echo "	TESTNET: https://gate-testnet.cryptopay.band/"
	echo "	SANDBOX: https://sandbox.cryptopay.band/widget/"
	echo
	echo "See https://developers.cryptopay.band/#environments for details..."
	echo
fi

mv ./ui/ecommerce.html ./ui/ecommerce.html.bak
cat ./ui/ecommerce.html.bak \
	| sed -re "s~^(\\s*<script\\s*src=\\\").*(\\/[^\\/]*widget.*\\.js\\\"><\\/script>.*)$~\1$GATE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*widgetUrl\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*gatewayId\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATE_ID\2~g" \
	> ./ui/ecommerce.html

mv ./ui/eservice.html ./ui/eservice.html.bak
cat ./ui/eservice.html.bak \
	| sed -re "s~^(\\s*<script\\s*src=\\\").*(\\/[^\\/]*widget.*\\.js\\\"><\\/script>.*)$~\1$GATE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*widgetUrl\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*gatewayId\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATE_ID\2~g" \
	> ./ui/eservice.html

mv ./ui/gambling.html ./ui/gambling.html.bak
cat ./ui/gambling.html.bak \
	| sed -re "s~^(\\s*<script\\s*src=\\\").*(\\/[^\\/]*widget.*\\.js\\\"><\\/script>.*)$~\1$GATE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*widgetUrl\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*gatewayId\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATE_ID\2~g" \
	> ./ui/gambling.html

exec node /usr/local/cryptopay-demo/service/nodejs/bin/app.js $@
