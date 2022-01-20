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
	export GATE_URL="https://gate.pay-cex-test.net/"
	echo "Warning. A GATE_URL environment variable is not defined. Fallback to the local deployment environment."
	echo
else
	case "${GATE_URL}" in
		*/)
			;;
		*)
			GATE_URL="${GATE_URL}/"
			echo "Normalize GATE_URL: ${GATE_URL}"
			;;
	esac
fi

cd /usr/local/cexiolabs/cexpay.gate.integration-demo

mv ./ui/ecommerce.html ./ui/ecommerce.html.bak
cat ./ui/ecommerce.html.bak \
	| sed -re "s~^(\\s*<script\\s*src=\\\").*(\\/*js\/widget.*\\.js\\\"><\\/script>.*)$~\1$GATE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*widgetUrl\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*gatewayId\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATE_ID\2~g" \
	> ./ui/ecommerce.html

mv ./ui/eservice.html ./ui/eservice.html.bak
cat ./ui/eservice.html.bak \
	| sed -re "s~^(\\s*<script\\s*src=\\\").*(\\/*js\/widget.*\\.js\\\"><\\/script>.*)$~\1$GATE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*widgetUrl\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*gatewayId\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATE_ID\2~g" \
	> ./ui/eservice.html

mv ./ui/gambling.html ./ui/gambling.html.bak
cat ./ui/gambling.html.bak \
	| sed -re "s~^(\\s*<script\\s*src=\\\").*(\\/*js\/widget.*\\.js\\\"><\\/script>.*)$~\1$GATE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*widgetUrl\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*gatewayId\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATE_ID\2~g" \
	> ./ui/gambling.html

exec node ./service/nodejs/bin/app.js $@
