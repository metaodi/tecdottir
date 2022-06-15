const _ = require('lodash');
const Moment = require('moment-timezone');
const { Pool } = require('pg')
const result = require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err) // your callback here
  process.exit(-1)
})

exports.measurements = measurements;
exports.stations = stations;

var keyMapping = {
    'timestamp_cet': {
        unit: '',
        parseFn: (v) => Moment(v).tz('Europe/Zurich').format()
    },
    'air_temperature': {
        unit: '°C',
        parseFn: parseFloat
    },
    'water_temperature': {
        unit: '°C',
        parseFn: parseFloat
    },
    'wind_gust_max_10min': {
        unit: 'm/s',
        parseFn: parseFloat
    },
    'wind_speed_avg_10min': {
        unit: 'm/s',
        parseFn: parseFloat
    },
    'wind_force_avg_10min': {
        unit: 'bft',
        parseFn: parseFloat
    },
    'wind_direction': {
        unit: '°',
        parseFn: parseInt
    },
    'windchill': {
        unit: '°C',
        parseFn: parseFloat
    },
    'barometric_pressure_qfe': {
        unit: 'hPa',
        parseFn: parseFloat
    },
    'precipitation': {
        unit: 'mm',
        parseFn: parseFloat
    },
    'dew_point': {
        unit: '°C',
        parseFn: parseFloat
    },
    'global_radiation': {
        unit: 'W/m²',
        parseFn: parseFloat
    },
    'humidity': {
        unit: '%',
        parseFn: parseFloat
    },
    'water_level': {
        unit: 'm',
        parseFn: parseFloat
    }
};

function measurements(req, res) {
  var station = req.swagger.params.station.value;
  var startDate = req.swagger.params.startDate.value || Moment().toISOString();
  var endDate = req.swagger.params.endDate.value || Moment().add(1, 'days').toISOString();

  var startDateObj = Moment(startDate).tz('Europe/Zurich').startOf('day');
  var endDateObj = Moment(endDate).tz('Europe/Zurich').startOf('day');

  queryDatabase(pool, station, startDateObj, endDateObj)
   .then(result => {
         res.json(result);
   }) 
}

async function queryDatabase(pool, station, startDate, endDate) {
  var query = `SELECT t.* FROM ${station} t
               WHERE timestamp_cet >= '${startDate.toISOString()}'::timestamptz
               AND timestamp_cet < '${endDate.toISOString()}'::timestamptz
               ORDER BY timestamp_cet`;
  var client;
  try {
      client = await pool.connect()
      const dbres = await client.query(query)
      var container = _.map(dbres.rows, function(row) {
          return {
              'station': station,
              'timestamp': row['timestamp_utc'],
              'values': _.mapValues(_.omit(row, ['timestamp_utc']), function(element, attr) {
                  var config = configFor(attr, keyMapping);
                  return {
                      'value': config.parseFn(element),
                      'unit': config.unit,
                      'status': 'ok'
                  };
              })
          }
      });
     return {
         ok: true,
         result: container
     };
  } catch (err) {
    console.log(err.stack)
    return {
        ok: false,
        message: err
    };
  } finally {
      client.release()
  }
}

function stations(req, res) {
    var result = {
        ok: true,
        result: [
            {
                slug: 'tiefenbrunnen', 
                title: 'Tiefenbrunnen'
            },
            {
                slug: 'mythenquai',
                title: 'Mythenquai'
            }
        ]
    };
    res.json(result);
}

function configFor(title, keyMapping) {
    if (title in keyMapping) {
        return keyMapping[title];
    }
    return {
        unit: '',
        parseFn: _.identity
    };
}
