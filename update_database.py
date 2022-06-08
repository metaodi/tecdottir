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
import psycopg2
arguments = docopt(__doc__, version='Update database with CSV file 1.0')

try:
    DB_URL = os.getenv('DATABASE_URL')
    print("Import database")
    
    # read database connection url from the enivron variable we just set.
    DATABASE_URL = os.environ.get('DATABASE_URL')
    con = None
    try:
        # create a new database connection by calling the connect() function
        con = psycopg2.connect(DB_URL)
    
        #  create a new cursor
        cur = conn.cursor()
        
        # execute an SQL statement to get the HerokuPostgres database version
        print('PostgreSQL database version:')
        cur.execute('SELECT version()')
    
        # display the PostgreSQL database server version
        db_version = cur.fetchone()
        print(db_version)
           
         # close the communication with the HerokuPostgres
        cur.close()
    finally:
        # close the communication with the database server by calling the close()
        if con is not None:
            con.close()
            print('Database connection closed.')
except Exception as e:
    print("Error: %s" % e, file=sys.stderr)
    print(traceback.format_exc(), file=sys.stderr)
    sys.exit(1)
