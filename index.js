var Moment = require('moment');
var Async = require('async');
var Request = require('superagent');
var Cheerio = require('cheerio');
var Encoding = require("encoding");
var _ = require('lodash');
var Express = require('express');

var app = Express()

app.get('/', function (req, res) {
    res.send('Hello World!')
})

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!')
})


function getMeasurements(startDate, endDate) {
    var startDateObj = Moment(startDate);
    var endDateObj = Moment(endDate);

    Request
        .post('https://www.tecson-data.ch/zurich/tiefenbrunnen/uebersicht/messwerte.php')
        .type('form')
        .responseType('blob')
        .send({'messw_beg': startDateObj.format('DD.MM.YYYY')})
        .send({'messw_end': endDateObj.format('DD.MM.YYYY')})
        .send({'auswahl': 2})
        .send({'combilog': 'tiefenbrunnen'})
        .end(function(err, res) {
            if (err) {
                console.log('Tecson returned an error: ' + err);
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
                        valueSet[headers[i].text] = {
                            "value": valueText,
                            "unit": headers[i].unit
                        };
                    });
                    values.push(valueSet);
                });
                console.log(headers);
                console.log(values);
            });

        });
}
