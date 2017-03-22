var Moment = require('moment-timezone');
var Async = require('async');
var Request = require('superagent');
var _ = require('lodash');

// var startDateObj = Moment(startDate).tz('Europe/Zurich');
// var endDateObj = Moment(endDate).tz('Europe/Zurich');

// .send({'start_date': startDateObj.format('DD.MM.YYYY')})
// .send({'end_date': endDateObj.format('DD.MM.YYYY')})


Request
    .post('https://www.tecson-data.ch/zurich/tiefenbrunnen/uebersicht/messwerte.php')
    .type('form')
    .send({'messw_beg': '22.03.2017'})
    .send({'messw_end': '23.03.2017'})
    .send({'auswahl': 2})
    .send({'combilog': 'tiefenbrunnen'})
    .end(function(err, res) {
        if (err) {
            console.log('Tecson returned an error: ' + err);
            return;
        }
        console.log(res);
    });
