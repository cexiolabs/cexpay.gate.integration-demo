#!/bin/sh

set -e

BASE_URL="https://evolution.cryptopay.band"
GATEWAY_ID=""

[ -z "$GATE_API_GATEWAY_ID" ] || GATEWAY_ID=$GATE_API_GATEWAY_ID; 
#[ -z "$GATE_WIDGET_URL" ] || BASE_URL=$GATE_WIDGET_URL;
BASE_URL=$GATE_WIDGET_URL;


if [ -z "$GATEWAY_ID" ] 
then
	echo "GatewayId is not defined, please define GATE_API_GATEWAY_ID environment variable.";
	exit 1;
fi

echo "GatewayId: '$GATEWAY_ID'."
echo "Widget base URL: '$BASE_URL'."

cat ./ui/ecommerce.html \
	| sed -re "s~^(\\s*<script\\s*src=\\\").*(\\/[^\\/]*widget.*\\.js\\\"><\\/script>.*)$~\1$BASE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*widgetBaseUrl\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$BASE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*gatewayId\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATEWAY_ID\2~g" \
	> ./ui/ecommerce-new.html

mv ./ui/ecommerce-new.html ./ui/ecommerce.html

cat ./ui/eservice.html \
	| sed -re "s~^(\\s*<script\\s*src=\\\").*(\\/[^\\/]*widget.*\\.js\\\"><\\/script>.*)$~\1$BASE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*widgetBaseUrl\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$BASE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*gatewayId\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATEWAY_ID\2~g" \
	> ./ui/eservice-new.html

mv ./ui/eservice-new.html ./ui/eservice.html

cat ./ui/gambling.html \
	| sed -re "s~^(\\s*<script\\s*src=\\\").*(\\/[^\\/]*widget.*\\.js\\\"><\\/script>.*)$~\1$BASE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*widgetBaseUrl\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$BASE_URL\2~g" \
	| sed -re "s~^(\\s*const\\s*gatewayId\\s*=\\s*\\\")[^\\\"]*(.*)$~\1$GATEWAY_ID\2~g" \
	> ./ui/gambling-new.html

mv ./ui/gambling-new.html ./ui/gambling.html

if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ]; then
  set -- node "$@"
fi

exec "$@"