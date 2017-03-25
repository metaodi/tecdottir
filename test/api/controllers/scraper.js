var should = require('should');
var request = require('supertest');
var fs = require('fs');
var nock = require('nock');
var server = require('../../../app');

describe('controllers', function() {
    describe('scraper', function() {
        describe('GET /measurements', function() {

            it('should return something', function(done) {
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
                var content = fs.readFileSync('./test/api/controllers/mythenquai-fixture-2017-03-24.html');
                var scope = nock('https://www.tecson-data.ch')
                				.post('/zurich/mythenquai/uebersicht/messwerte.php')
                				.reply(200, content);

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
        });
    });
});
