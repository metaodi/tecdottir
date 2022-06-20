var should = require('should');
var request = require('supertest');
var fs = require('fs');
var Sinon = require('sinon');
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
                var clientStub = Sinon.stub();
                clientStub.query = Sinon.stub().resolves(mockRes);
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
                    res.body.ok.should.be.true;
                    res.body.row_count.should.equal(3); 
                    res.body.result.length.should.equal(3); 

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
                    res.body.ok.should.be.false;
                    res.body.message.name.should.equal("Error: DB"); 

                    done();
                  });
            });

            it('tiefenbrunnen should return a valid JSON response', function(done) {
                // setup  mock
                var content = fs.readFileSync('./test/api/controllers/tiefenbrunnen-fixture-2022-03-31.json');
                var mockRes = JSON.parse(content);
                var clientStub = Sinon.stub();
                clientStub.query = Sinon.stub().resolves(mockRes);
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
                    res.body.ok.should.be.true;
                    res.body.row_count.should.equal(3); 
                    res.body.result.length.should.equal(3); 

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

            it('should return an empty array for an empty result JSON', function(done) {
                // setup  mock
                var content = fs.readFileSync('./test/api/controllers/tiefenbrunnen-fixture-empty.json');
                var mockRes = JSON.parse(content);
                var clientStub = Sinon.stub();
                clientStub.query = Sinon.stub().resolves(mockRes);
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
                    res.body.ok.should.be.true;
                    res.body.result.length.should.equal(0);
                    res.body.row_count.should.equal(0); 

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
