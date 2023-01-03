#!/bin/sh

DIR="$(cd "$(dirname "$0")" && pwd)"

# Mythenquai
$DIR/update_database.py -f messwerte_mythenquai_2023.csv -t mythenquai --purge --drop
$DIR/update_database.py -f messwerte_mythenquai_2022.csv -t mythenquai
$DIR/update_database.py -f messwerte_mythenquai_2007-2021.csv -t mythenquai 

# Tiefenbrunnen
$DIR/update_database.py -f messwerte_tiefenbrunnen_2023.csv -t tiefenbrunnen --purge --drop
$DIR/update_database.py -f messwerte_tiefenbrunnen_2022.csv -t tiefenbrunnen
$DIR/update_database.py -f messwerte_tiefenbrunnen_2007-2021.csv -t tiefenbrunnen
