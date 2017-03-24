var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

  describe('scraper', function() {

    describe('GET /measurements', function() {

      it('should return something', function(done) {

        request(server)
          .get('/measurements/tiefenbrunnen')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.not.be.empty;

            done();
          });
      });

      it('should not work without a station name', function(done) {

        request(server)
          .get('/measurements')
          .set('Accept', 'application/json')
          .expect(404)
          .end(function(err, res) {
            done();
          });
      });

      it('should accept a startDate and endDate parameter', function(done) {

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
