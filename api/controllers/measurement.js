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
  queryDatabase(pool, req.swagger.params)
   .then(result => {
     res.json(result);
   }) 
}

async function queryDatabase(pool, params) {
  var station = params.station.value;
  var startDate = params.startDate.value || Moment().toISOString();
  var endDate = params.endDate.value || Moment().add(1, 'days').toISOString();
  var sort = params.sort.value || 'timestamp_cet asc';
  var limit = params.limit.value || 500;
  var offset = params.offset.value || 0;

  var startDateObj = Moment(startDate).tz('Europe/Zurich').startOf('day');
  var endDateObj = Moment(endDate).tz('Europe/Zurich').startOf('day');

  var query = `SELECT t.* FROM ${station} t
               WHERE timestamp_cet >= $1
               AND timestamp_cet < $2
               ORDER BY $3
               LIMIT $4
               OFFSET $5`;
  var params = [
      startDateObj.toISOString(),
      endDateObj.toISOString(),
      sort,
      limit,
      offset
  ];
  var client;
  try {
      client = await pool.connect()
      const dbres = await client.query(query, params)
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
         row_count: dbres.rowCount,
         result: container
     };
  } catch (err) {
    console.error(err.stack)
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
