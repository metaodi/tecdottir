const _ = require('lodash');
const Moment = require('moment-timezone');
const { Pool } = require('pg')
const result = require('dotenv').config()


var ssl = {
    rejectUnauthorized: false
}
if ("DATABASE_URL" in process.env && process.env.DATABASE_URL.includes('localhost')) {
    ssl = false;
} 
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: ssl
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
  var startDate = params.startDate.value;
  var endDate = params.endDate.value;
  var sort = params.sort.value || 'timestamp_cet desc';
  // this is to avoid a BC-break, before introducing the sort value
  // the result was always sorted by `timestamp_cet asc`, but we want to 
  // use `timestamp_cet desc` as default value on Swagger UI
  if (!params.sort.raw) {
      sort = 'timestamp_cet asc';
  }
  var limit = (typeof params.limit.value !== 'undefined') ? params.limit.value : 500;
  var offset = params.offset.value || 0;

  var queryObj = buildQuery(station, startDate, endDate, sort, limit, offset);
  const {query, countQuery, queryParams, countParams} = queryObj;

  var client;
  try {
      client = await pool.connect()
      const dbres = await client.query(query, queryParams);
      const countRes = await client.query(countQuery, countParams);
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
          total_count: parseInt(countRes.rows[0]['total_count']),
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

function buildQuery(station, startDate, endDate, sort, limit, offset) {
    var query = `SELECT * FROM ${station} WHERE 1 = 1`;
    var countQuery = `SELECT COUNT(1) AS total_count FROM ${station} WHERE 1 = 1`;
    var params = [];
    var countParams = [];

    if (startDate) {
        var startDateObj = Moment(startDate).tz('Europe/Zurich').startOf('day');
        const sc = params.push(startDateObj);
        query = `${query} AND timestamp_cet >= $${sc}`
        const csc = countParams.push(startDateObj)
        countQuery = `${countQuery} AND timestamp_cet >= $${csc}`
    }
    if (endDate) {
        var endDateObj = Moment(endDate).tz('Europe/Zurich').startOf('day');
        const ec = params.push(endDateObj);
        query = `${query} AND timestamp_cet < $${ec}`;
        const cec = countParams.push(endDateObj)
        countQuery = `${countQuery} AND timestamp_cet < $${cec}`
    }
    
    query = `${query} ORDER BY ${sort}`;

    const lc = params.push(limit);
    query = `${query} LIMIT $${lc}`;

    const oc = params.push(offset);
    query = `${query} OFFSET $${oc}`;

    return {
        'query': query,
        'countQuery': countQuery,
        'queryParams': params,
        'countParams': countParams
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
