const _ = require('lodash');
const Moment = require('moment-timezone');
const { Pool, Client } = require('pg')
const result = require('dotenv').config()
const fs = require('fs');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

var query = `SELECT t.* FROM tiefenbrunnen t
             WHERE timestamp_cet >= '2022-03-30T22:00:00Z'::timestamptz
             AND timestamp_cet < '2022-03-31T22:00:00Z'::timestamptz
             ORDER BY timestamp_cet`;
(async () => {
    var client;
    try {
        client = await pool.connect()
        const dbres = await client.query(query)
        const data = JSON.stringify(dbres.rows, null, 2);
        console.log(dbres.rows)
        fs.writeFile('rows.json', data, (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        });
    } catch (err) {
      console.log(err.stack)
    } finally {
        client.release()
    }
})();

