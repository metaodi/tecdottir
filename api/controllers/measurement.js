var Moment = require('moment-timezone');
var Async = require('async');
var Request = require('superagent');
var Cheerio = require('cheerio');
var Encoding = require("encoding");
var _ = require('lodash');

exports.measurements = measurements;
exports.stations = stations;

var keyMapping = {
    'Datum / Uhrzeit (MEZ)': {
        label: 'timestamp_cet',
        parseFn: _.identity
    },
    'Lufttemperatur': {
        label: 'air_temperature',
        parseFn: parseFloat
    },
    'Wassertemperatur': {
        label: 'water_temperature',
        parseFn: parseFloat
    },
    'Windböen (max) 10 min.': {
        label: 'wind_gust_max_10min',
        parseFn: parseFloat
    },
    'Windgeschw. Ø 10min.': {
        label: 'wind_speed_avg_10min',
        parseFn: parseFloat
    },
    'Windstärke Ø 10 min.': {
        label: 'wind_force_avg_10min',
        parseFn: parseInt,
    },
    'Windrichtung': {
        label: 'wind_direction',
        parseFn: parseInt
    },
    'Windchill': {
        label: 'windchill',
        parseFn: parseFloat
    },
    'Luftdruck QFE': {
        label: 'barometric_pressure_qfe',
        parseFn: parseFloat
    },
    'Niederschlag': {
        label: 'precipitation',
        parseFn: parseInt
    },
    'Taupunkt': {
        label: 'dew_point',
        parseFn: parseFloat
    },
    'Globalstrahlung': {
        label: 'global_radiation',
        parseFn: parseInt
    },
    'Luftfeuchte': {
        label: 'humidity',
        parseFn: parseInt
    },
    'Pegel': {
        label: 'water_level',
        parseFn: parseFloat
    }
    
};

function measurements(req, res) {
  var station = req.swagger.params.station.value;
  var startDate = req.swagger.params.startDate.value || Moment().toISOString();
  var endDate = req.swagger.params.endDate.value || Moment().toISOString();

  scrape(station, startDate, endDate, function(err, values) {
      var result;
      if (err) {
          result = {
              ok: false,
              message: err
          };
      } else {
          result = {
              ok: true,
              result: values
          };
      }
    
      res.json(result);
  });
}


function scrape(station, startDate, endDate, callback) {
    var startDateObj = Moment(startDate).tz('Europe/Zurich');
    var endDateObj = Moment(endDate).tz('Europe/Zurich');

    Request
        .post('https://www.tecson-data.ch/zurich/' + station + '/uebersicht/messwerte.php')
        .type('form')
        .send({'messw_beg': startDateObj.format('DD.MM.YYYY')})
        .send({'messw_end': endDateObj.format('DD.MM.YYYY')})
        .send({'auswahl': 2})
        .send({'combilog': station})
        .responseType('blob')
        .end(function(err, res) {
            if (err) {
                console.log("ERROR: ", err);
                callback('Tecson returned an error: ' + err);
                return;
            }
            // when responseType is set to 'blob' res.body is a buffer containing the content
            // the content is ISO-8859-1 encoded, we convert it to UTF-8
            var contentBuffer = Encoding.convert(res.body, 'utf8', 'latin1');
            var $ = Cheerio.load(contentBuffer);

            var headers = [];
            var values = [];
            $('table').eq(1).filter(function() {
                var table = $(this);
                var rows = table.find('tr');

                //extract the headers
                $(rows[0]).find('td').each(function(i, elem) {
                    var headerText = $(this).find('span').eq(0).text();
                    var unitText = $(this).find('span').eq(1).text();
                    headers.push(
                        {
                            'text': headerText,
                            'unit': unitText.trim().replace(/[\(\)]/g, '')
                        }
                    );
                });
                
                //remove the header row from rows
                rows.splice(0, 1);

                //extract the values
                $(rows).each(function(i, elem) {
                    var row = $(this);
                    var valueSet = {};
                    $(row).find('td').each(function(i, elem) {
                        var valueText = $(this).find('span').text();
                        var config = configFor(headers[i].text, keyMapping);
                        valueSet[config.label] = {
                            "value": config.parseFn(valueText),
                            "unit": headers[i].unit
                        };
                    }).get();
                    values.push({
                        station: station,
                        timestamp: Moment.tz(valueSet['timestamp_cet'].value, 'DD.MM.YYYY HH:mm:ss', 'Europe/Zurich').toISOString(),
                        values: valueSet
                    });
                }).get();
            });
            callback(null, values);
        });
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
        label: title,
        parseFn: _.identity
    };
}
