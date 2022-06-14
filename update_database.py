#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update the database with a CSV file

Usage:
  update_database.py --file <path-to-csv> --table <table-name> [--purge] [--drop]
  update_database.py (-h | --help)
  update_database.py --version

Options:
  -h, --help                Show this screen.
  --version                 Show version.
  -f, --file <path-to-csv>  Path to the CSV file.
  -t, --table <table-name>  Name of the database table to import the data into.
  -p, --purge               Purge the database before import the CSV.
  -d, --drop                Drop the database table before import the CSV.
"""


import datetime
import csv
import sys
import os
import traceback
import psycopg2
from docopt import docopt
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
arguments = docopt(__doc__, version='Update database with CSV file 1.0')


def create_table(cur, table, purge, drop):
    if drop:
        cur.execute(f"DROP TABLE IF EXISTS {table};")
    cur.execute(f"""
    CREATE TABLE IF NOT EXISTS {table} (
        timestamp_utc timestamptz,
        timestamp_cet timestamptz,
        air_temperature float,
        water_temperature float,
        wind_gust_max_10min float,
        wind_speed_avg_10min float,
        wind_force_avg_10min float,
        wind_direction int,
        windchill float,
        barometric_pressure_qfe float,
        precipitation float,
        dew_point float,
        global_radiation int,
        humidity float,
        water_level float
    );
    """)
    cur.execute(f"CREATE INDEX IF NOT EXISTS idx_timestamp_utc on {table}(timestamp_utc);")
    cur.execute(f"CREATE INDEX IF NOT EXISTS idx_timestamp_cet on {table}(timestamp_cet);")
    if purge:
        cur.execute(f"TRUNCATE {table};")



def load_csv(cur, path, table):
    with open(path, 'r') as f:
        next(f) # Skip the header row.
        cur.copy_from(f, table, sep=',', null='')


try:
    DB_URL = os.getenv('DATABASE_URL')
    if not DB_URL:
        raise Exception("DATABASE_URL not provided")
    print("Import database")
    
    # read database connection url from the enivron variable we just set.
    con = None
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()

        # print database info
        print('PostgreSQL database version:')
        cur.execute('SELECT version()')
        db_version = cur.fetchone()
        print(db_version)

        # create tables
        create_table(cur, arguments['--table'], arguments['--purge'], arguments['--drop'])
        
        # load csvs
        load_csv(cur, arguments['--file'], arguments['--table'])

        # commit changes
        conn.commit()
        
        cur.close()
    finally:
        # close the communication with the database server by calling the close()
        if conn is not None:
            conn.close()
            print('Database connection closed.')
except Exception as e:
    print("Error: %s" % e, file=sys.stderr)
    print(traceback.format_exc(), file=sys.stderr)
    sys.exit(1)
