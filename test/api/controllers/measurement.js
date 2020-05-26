var should = require('should');
var request = require('supertest');
var fs = require('fs');
var nock = require('nock');
var server = require('../../../app');

describe('controllers', function() {
    describe('scraper', function() {
        describe('GET /measurements', function() {

            it('mythenquai should return a valid JSON response', function(done) {
                // setup reqeust mock
                var content = fs.readFileSync('./test/api/controllers/mythenquai-fixture-2017-03-24.html');
                var scope = nock('https://www.tecson-data.ch')
                				.post('/zurich/mythenquai/uebersicht/messwerte.php')
                				.reply(200, content);

                request(server)
                  .get('/measurements/mythenquai')
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, res) {
                    should.not.exist(err);

                    res.body.should.not.be.empty;
                    res.body.ok.should.be.true;
                    res.body.result.length.should.equal(135); 

                    var firstResult = res.body.result[0];
                    var keys = Object.keys(firstResult.values);
                    firstResult.station.should.equal('mythenquai');
                    firstResult.timestamp.should.equal('2017-03-23T23:00:00.000Z');
                    keys.length.should.equal(14);

                    firstResult.values.timestamp_cet.value.should.equal('24.03.2017 00:00:00');
                    firstResult.values.timestamp_cet.unit.should.be.empty;
                    firstResult.values.air_temperature.value.should.equal(10.7);
                    firstResult.values.air_temperature.unit.should.equal('°C');
                    firstResult.values.water_temperature.value.should.equal(6.7);
                    firstResult.values.water_temperature.unit.should.equal('°C');
                    firstResult.values.wind_gust_max_10min.value.should.equal(3.6);
                    firstResult.values.wind_gust_max_10min.unit.should.equal('m/s');
                    firstResult.values.wind_speed_avg_10min.value.should.equal(2.1);
                    firstResult.values.wind_speed_avg_10min.unit.should.equal('m/s');
                    firstResult.values.wind_force_avg_10min.value.should.equal(2);
                    firstResult.values.wind_force_avg_10min.unit.should.equal('bft');
                    firstResult.values.wind_direction.value.should.equal(302);
                    firstResult.values.wind_direction.unit.should.equal('°');
                    firstResult.values.windchill.value.should.equal(9.6);
                    firstResult.values.windchill.unit.should.equal('°C');
                    firstResult.values.barometric_pressure_qfe.value.should.equal(967.2);
                    firstResult.values.barometric_pressure_qfe.unit.should.equal('hPa');
                    firstResult.values.precipitation.value.should.equal(0);
                    firstResult.values.precipitation.unit.should.equal('mm');
                    firstResult.values.dew_point.value.should.equal(7.7);
                    firstResult.values.dew_point.unit.should.equal('°C');
                    firstResult.values.global_radiation.value.should.equal(0);
                    firstResult.values.global_radiation.unit.should.equal('W/m²');
                    firstResult.values.humidity.value.should.equal(82);
                    firstResult.values.humidity.unit.should.equal('%');
                    firstResult.values.water_level.value.should.equal(405.92);
                    firstResult.values.water_level.unit.should.equal('m');

                    done();
                  });
            });

            it('tiefenbrunnen should return status = broken for water_temperature', function(done) {
                // setup reqeust mock
                var content = fs.readFileSync('./test/api/controllers/tiefenbrunnen-fixture-2020-05-25.html');
                var scope = nock('https://www.tecson-data.ch')
                				.post('/zurich/tiefenbrunnen/uebersicht/messwerte.php')
                				.reply(200, content);

                request(server)
                  .get('/measurements/tiefenbrunnen')
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, res) {
                    should.not.exist(err);

                    res.body.should.not.be.empty;
                    res.body.ok.should.be.true;
                    res.body.result.length.should.equal(139); 

                    var firstResult = res.body.result[0];
                    var keys = Object.keys(firstResult.values);
                    firstResult.station.should.equal('tiefenbrunnen');
                    firstResult.timestamp.should.equal('2020-05-24T22:00:00.000Z');
                    keys.length.should.equal(11);

                    firstResult.values.timestamp_cet.value.should.equal('25.05.2020 00:00:00');
                    firstResult.values.timestamp_cet.unit.should.be.empty;
                    firstResult.values.air_temperature.value.should.equal(13.5);
                    firstResult.values.air_temperature.unit.should.equal('°C');
                    firstResult.values.air_temperature.status.should.equal('ok');
                    firstResult.values.water_temperature.value.should.equal(17.8);
                    firstResult.values.water_temperature.unit.should.equal('°C');
                    firstResult.values.water_temperature.status.should.equal('broken');

                    done();
                  });
            });

            it('tiefenbrunnen should return a valid JSON response', function(done) {
                // setup reqeust mock
                var content = fs.readFileSync('./test/api/controllers/tiefenbrunnen-fixture-2017-03-24.html');
                var scope = nock('https://www.tecson-data.ch')
                				.post('/zurich/tiefenbrunnen/uebersicht/messwerte.php')
                				.reply(200, content);

                request(server)
                  .get('/measurements/tiefenbrunnen')
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, res) {
                    should.not.exist(err);

                    res.body.should.not.be.empty;
                    res.body.ok.should.be.true;
                    res.body.result.length.should.equal(142); 

                    var firstResult = res.body.result[0];
                    var keys = Object.keys(firstResult.values);
                    firstResult.station.should.equal('tiefenbrunnen');
                    firstResult.timestamp.should.equal('2017-03-23T23:00:00.000Z');
                    keys.length.should.equal(11);

                    firstResult.values.timestamp_cet.value.should.equal('24.03.2017 00:00:00');
                    firstResult.values.timestamp_cet.unit.should.be.empty;
                    firstResult.values.air_temperature.value.should.equal(10.2);
                    firstResult.values.air_temperature.unit.should.equal('°C');
                    firstResult.values.humidity.value.should.equal(84);
                    firstResult.values.humidity.unit.should.equal('%');
                    firstResult.values.wind_gust_max_10min.value.should.equal(3.0);
                    firstResult.values.wind_gust_max_10min.unit.should.equal('m/s');
                    firstResult.values.wind_speed_avg_10min.value.should.equal(0.8);
                    firstResult.values.wind_speed_avg_10min.unit.should.equal('m/s');
                    firstResult.values.wind_force_avg_10min.value.should.equal(1);
                    firstResult.values.wind_force_avg_10min.unit.should.equal('bft');
                    firstResult.values.wind_direction.value.should.equal(290);
                    firstResult.values.wind_direction.unit.should.equal('°');
                    firstResult.values.windchill.value.should.equal(10.0);
                    firstResult.values.windchill.unit.should.equal('°C');
                    firstResult.values.water_temperature.value.should.equal(5.7);
                    firstResult.values.water_temperature.unit.should.equal('°C');
                    firstResult.values.barometric_pressure_qfe.value.should.equal(967.0);
                    firstResult.values.barometric_pressure_qfe.unit.should.equal('hPa');
                    firstResult.values.dew_point.value.should.equal(7.6);
                    firstResult.values.dew_point.unit.should.equal('°C');

                    should.not.exist(firstResult.values.water_level);
                    should.not.exist(firstResult.values.global_radiation);

                    done();
                  });
            });

            it('should not work without a station name', function(done) {
                request(server)
                  .get('/measurements')
                  .set('Accept', 'application/json')
                  .expect(404)
                  .end(function(err, res) {
                    should.not.exist(err);
                    done();
                  });
            });

            it('should accept a startDate and endDate parameter', function(done) {
                var scope = nock('https://www.tecson-data.ch')
                				.post('/zurich/mythenquai/uebersicht/messwerte.php')
                				.reply(200, '');

                request(server)
                  .get('/measurements/mythenquai')
                  .query({ startDate: '2017-03-22'})
                  .query({ endDate: '2017-03-23'})
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, res) {
                    should.not.exist(err);

                    res.body.should.not.be.empty;

                    done();
                  });
            });

            it('should return an empty array for an empty result HTML', function(done) {
                var content = fs.readFileSync('./test/api/controllers/tiefenbrunnen-fixture-empty.html');
                var scope = nock('https://www.tecson-data.ch')
                				.post('/zurich/tiefenbrunnen/uebersicht/messwerte.php')
                				.reply(200, content);

                request(server)
                  .get('/measurements/tiefenbrunnen')
                  .query({ startDate: '2117-03-25'})
                  .query({ endDate: '2117-03-25'})
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, res) {
                    should.not.exist(err);

                    res.body.should.not.be.empty;
                    res.body.result.length.should.equal(0);

                    done();
                  });
            });
        });
        describe('GET /stations', function() {

            it('should return a valid JSON response', function(done) {
                request(server)
                  .get('/stations')
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, res) {
                    should.not.exist(err);

                    res.body.should.not.be.empty;
                    res.body.ok.should.be.true;
                    res.body.result.length.should.equal(2); 

                    var firstResult = res.body.result[0];
                    firstResult.slug.should.equal('tiefenbrunnen');
                    firstResult.title.should.equal('Tiefenbrunnen');

                    done();
                  });
            });
        });
    });
});
