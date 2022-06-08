#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update the database with a CSV file

Usage:
  update_database.py --file <path-to-csv> [--purge]
  update_database.py (-h | --help)
  update_database.py --version
Options:
  -h, --help                Show this screen.
  --version                 Show version.
  -f, --file <path-to-csv>  Path to the CSV file.
  -p, --purge               Purge the database before import the CSV.
"""


import datetime
import csv
import sys
import os
from docopt import docopt
arguments = docopt(__doc__, version='Update database with CSV file 1.0')

try:
    DB_URL = os.getenv('DATABASE_URL')
    print("Import database")
except Exception as e:
    print("Error: %s" % e, file=sys.stderr)
    print(traceback.format_exc(), file=sys.stderr)
    sys.exit(1)
