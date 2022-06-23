var should = require('should');
var request = require('supertest');
var fs = require('fs');
var Sinon = require('sinon');
var Moment = require('moment-timezone');
const { Client, Pool } = require('pg');
var server = require('../../../app');

describe('controllers', function() {
    describe('measurements', function() {
        afterEach(function () {
            Sinon.restore();
        });

        describe('GET /measurements', function() {

            it('mythenquai should return a valid JSON response', function(done) {
                // setup  mock
                var content = fs.readFileSync('./test/api/controllers/mythenquai-fixture-2017-03-31.json');
                var mockRes = JSON.parse(content);

                var totalCount = fs.readFileSync('./test/api/controllers/total_count.json');
                var mockCount = JSON.parse(totalCount);

                var clientStub = Sinon.stub();
                var queryStub = Sinon.stub();
                queryStub.onFirstCall().resolves(mockRes);
                queryStub.onSecondCall().resolves(mockCount);
                clientStub.query = queryStub;
                clientStub.release = Sinon.stub();
                var stubPool = Sinon.stub(Pool.prototype, 'connect').resolves(clientStub);
                
                request(server)
                  .get('/measurements/mythenquai')
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, res) {
                    should.not.exist(err);

                    res.body.should.not.be.empty;
                    res.body.ok.should.equal(true);
                    res.body.row_count.should.equal(3); 
                    res.body.result.length.should.equal(3); 
                    res.body.total_count.should.equal(123); 

                    var firstResult = res.body.result[0];
                    var keys = Object.keys(firstResult.values);
                    firstResult.station.should.equal('mythenquai');
                    firstResult.timestamp.should.equal('2017-03-30T22:00:00.000Z');
                    keys.length.should.equal(14);

                    firstResult.values.timestamp_cet.value.should.equal('2017-03-31T00:00:00+02:00');
                    firstResult.values.timestamp_cet.unit.should.be.empty;
                    firstResult.values.air_temperature.value.should.equal(11.7);
                    firstResult.values.air_temperature.unit.should.equal('°C');
                    firstResult.values.water_temperature.value.should.equal(11.5);
                    firstResult.values.water_temperature.unit.should.equal('°C');
                    firstResult.values.wind_gust_max_10min.value.should.equal(1.4);
                    firstResult.values.wind_gust_max_10min.unit.should.equal('m/s');
                    firstResult.values.wind_speed_avg_10min.value.should.equal(0.9);
                    firstResult.values.wind_speed_avg_10min.unit.should.equal('m/s');
                    firstResult.values.wind_force_avg_10min.value.should.equal(0.9);
                    firstResult.values.wind_force_avg_10min.unit.should.equal('bft');
                    firstResult.values.wind_direction.value.should.equal(175);
                    firstResult.values.wind_direction.unit.should.equal('°');
                    firstResult.values.windchill.value.should.equal(11.7);
                    firstResult.values.windchill.unit.should.equal('°C');
                    firstResult.values.barometric_pressure_qfe.value.should.equal(974.6);
                    firstResult.values.barometric_pressure_qfe.unit.should.equal('hPa');
                    firstResult.values.precipitation.value.should.equal(0);
                    firstResult.values.precipitation.unit.should.equal('mm');
                    firstResult.values.dew_point.value.should.equal(8.1);
                    firstResult.values.dew_point.unit.should.equal('°C');
                    firstResult.values.global_radiation.value.should.equal(0);
                    firstResult.values.global_radiation.unit.should.equal('W/m²');
                    firstResult.values.humidity.value.should.equal(78);
                    firstResult.values.humidity.unit.should.equal('%');
                    firstResult.values.water_level.value.should.equal(405.9);
                    firstResult.values.water_level.unit.should.equal('m');

                    done();
                  });
            });

            it('tiefenbrunnen should return ok = false for db error', function(done) {
                // setup  mock
                var clientStub = Sinon.stub();
                clientStub.query = Sinon.stub().rejects("Error: DB");
                clientStub.release = Sinon.stub();
                var stubPool = Sinon.stub(Pool.prototype, 'connect').resolves(clientStub);

                request(server)
                  .get('/measurements/tiefenbrunnen')
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, res) {
                    should.not.exist(err);

                    res.body.should.not.be.empty;
                    res.body.ok.should.equal(false);
                    res.body.message.name.should.equal("Error: DB"); 

                    done();
                  });
            });

            it('tiefenbrunnen should return a valid JSON response', function(done) {
                // setup  mock
                var content = fs.readFileSync('./test/api/controllers/tiefenbrunnen-fixture-2022-03-31.json');
                var mockRes = JSON.parse(content);

                var totalCount = fs.readFileSync('./test/api/controllers/total_count.json');
                var mockCount = JSON.parse(totalCount);

                var clientStub = Sinon.stub();
                var queryStub = Sinon.stub();
                queryStub.onFirstCall().resolves(mockRes);
                queryStub.onSecondCall().resolves(mockCount);
                clientStub.query = queryStub;
                clientStub.release = Sinon.stub();
                var stubPool = Sinon.stub(Pool.prototype, 'connect').resolves(clientStub);

                request(server)
                  .get('/measurements/tiefenbrunnen')
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, res) {
                    should.not.exist(err);

                    res.body.should.not.be.empty;
                    res.body.ok.should.equal(true);
                    res.body.row_count.should.equal(3); 
                    res.body.result.length.should.equal(3); 
                    res.body.total_count.should.equal(123); 

                    var firstResult = res.body.result[0];
                    var keys = Object.keys(firstResult.values);
                    firstResult.station.should.equal('tiefenbrunnen');
                    firstResult.timestamp.should.equal('2022-03-30T22:00:00.000Z');
                    keys.length.should.equal(14);

                    firstResult.values.timestamp_cet.value.should.equal('2022-03-31T00:00:00+02:00');
                    firstResult.values.timestamp_cet.unit.should.be.empty;
                    firstResult.values.air_temperature.value.should.equal(9);
                    firstResult.values.air_temperature.unit.should.equal('°C');
                    firstResult.values.humidity.value.should.equal(91);
                    firstResult.values.humidity.unit.should.equal('%');
                    firstResult.values.wind_gust_max_10min.value.should.equal(0);
                    firstResult.values.wind_gust_max_10min.unit.should.equal('m/s');
                    firstResult.values.wind_speed_avg_10min.value.should.equal(0);
                    firstResult.values.wind_speed_avg_10min.unit.should.equal('m/s');
                    firstResult.values.wind_force_avg_10min.value.should.equal(0);
                    firstResult.values.wind_force_avg_10min.unit.should.equal('bft');
                    firstResult.values.wind_direction.value.should.equal(0);
                    firstResult.values.wind_direction.unit.should.equal('°');
                    firstResult.values.windchill.value.should.equal(9);
                    firstResult.values.windchill.unit.should.equal('°C');
                    firstResult.values.water_temperature.value.should.equal(10.3);
                    firstResult.values.water_temperature.unit.should.equal('°C');
                    firstResult.values.barometric_pressure_qfe.value.should.equal(952.2);
                    firstResult.values.barometric_pressure_qfe.unit.should.equal('hPa');
                    firstResult.values.dew_point.value.should.equal(7.6);
                    firstResult.values.dew_point.unit.should.equal('°C');

                    firstResult.values.water_level.should.be.null;
                    firstResult.values.global_radiation.should.be.null;

                    done();
                  });
            });

            it('should not work without a station name', function(done) {
                var clientStub = Sinon.stub();
                clientStub.query = Sinon.stub().resolves({"rows": []});
                clientStub.release = Sinon.stub();
                var stubPool = Sinon.stub(Pool.prototype, 'connect').resolves(clientStub);

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
                var clientStub = Sinon.stub();
                clientStub.query = Sinon.stub().resolves({"rows": []});
                clientStub.release = Sinon.stub();
                var stubPool = Sinon.stub(Pool.prototype, 'connect').resolves(clientStub);

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

            it('should accept pagination parameter', function(done) {
                var clientStub = Sinon.stub();
                clientStub.query = Sinon.stub().resolves({"rows": []});
                clientStub.release = Sinon.stub();
                var stubPool = Sinon.stub(Pool.prototype, 'connect').resolves(clientStub);

                request(server)
                  .get('/measurements/mythenquai')
                  .query({ startDate: '2022-06-22'})
                  .query({ endDate: '2022-06-23'})
                  .query({ sort: 'air_temperature desc'})
                  .query({ limit: 10})
                  .query({ offset: 0})
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, res) {
                    should.not.exist(err);

                    res.body.should.not.be.empty;
                    var query =   `SELECT * FROM mythenquai
                                   WHERE timestamp_cet >= $1
                                   AND timestamp_cet < $2
                                   ORDER BY air_temperature desc
                                   LIMIT $3
                                   OFFSET $4`;
                    var cleanQuery = query.replace(/\s+/g, " ");
                    var args = clientStub.query.getCall(0).args;

                    var argQuery = args[0].replace(/\s+/g, " ");
                    argQuery.should.be.equal(cleanQuery);

                    var [startParam, endParam, limitParam, offsetParam] = args[1];
                    args[1].length.should.be.equal(4);
                    startParam.toISOString().should.be.equal('2022-06-21T22:00:00.000Z');
                    endParam.toISOString().should.be.equal('2022-06-22T22:00:00.000Z');
                    limitParam.should.be.equal(10);
                    offsetParam.should.be.equal(0);

                    done();
                  });
            });

            it('should use default parameters', function(done) {
                var clientStub = Sinon.stub();
                clientStub.query = Sinon.stub().resolves({"rows": []});
                clientStub.release = Sinon.stub();
                var stubPool = Sinon.stub(Pool.prototype, 'connect').resolves(clientStub);

                request(server)
                  .get('/measurements/tiefenbrunnen')
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, res) {
                    should.not.exist(err);

                    res.body.should.not.be.empty;
                    var today = Moment().tz('Europe/Zurich').startOf('day');
                    var args = clientStub.query.getCall(0).args[1];
                    var [startParam, endParam, limitParam, offsetParam] = args;
                    args.length.should.be.equal(4);
                    startParam.toISOString().should.be.equal(today.toISOString());
                    endParam.toISOString().should.be.equal(today.add(1, 'days').toISOString());
                    limitParam.should.be.equal(500);
                    offsetParam.should.be.equal(0);

                    done();
                  });
            });

            it('should return an empty array for an empty result JSON', function(done) {
                // setup  mock
                var content = fs.readFileSync('./test/api/controllers/tiefenbrunnen-fixture-empty.json');
                var totalCount = fs.readFileSync('./test/api/controllers/total_count.json');
                var mockRes = JSON.parse(content);
                var mockCount = JSON.parse(totalCount);
                var clientStub = Sinon.stub();
                var queryStub = Sinon.stub();
                queryStub.onFirstCall().resolves(mockRes);
                queryStub.onSecondCall().resolves(mockCount);
                clientStub.query = queryStub;
                clientStub.release = Sinon.stub();
                var stubPool = Sinon.stub(Pool.prototype, 'connect').resolves(clientStub);

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
                    res.body.ok.should.equal(true);
                    res.body.result.length.should.equal(0);
                    res.body.row_count.should.equal(0); 
                    res.body.total_count.should.equal(123); 

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
                    res.body.ok.should.equal(true);
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
