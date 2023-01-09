#!/bin/sh

DIR="$(cd "$(dirname "$0")" && pwd)"

# Mythenquai
$DIR/update_database.py -f messwerte_mythenquai_seit2007-heute.csv -t mythenquai --purge --drop

# Tiefenbrunnen
$DIR/update_database.py -f messwerte_tiefenbrunnen_seit2007-heute.csv -t tiefenbrunnen --purge --drop
