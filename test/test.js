process.env.NODE_ENV = 'test';
const request = require('supertest');
const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect


const connection = require('../utils/connection');
const {server} = require('../index');

describe("Test CampusDirector Routes", function() {
    it("it should get all CDs", function(done) {
        request(server)
        .get("/api/v1/campusDirector/get/all")
        .expect(200)
        .end(function(err, res) {
          if (err) done(err);
          expect(res.body.status).to.equal("success");
          done();
        });
    });
});


after((done) => {
    connection.close()
    .then(() => done())
    .catch(err => done(err));
});