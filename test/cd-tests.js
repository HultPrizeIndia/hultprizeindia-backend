process.env.NODE_ENV = 'test';
const request = require('supertest');
const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect


const connection = require('../utils/connection');
// const {server} = require('../index');
const server = require('../index');

// afterEach((done) => {
//     connection.dropAll();
//     done();
// });

describe("Test CampusDirector POST Routes", function() {
    it("Signup CDs with wrong input", function(done) {
        request(server)
        .post("/api/v1/campusDirector/signup")
        .send({
            // "firstName": "test_Raghav",
            "lastName": "test_Vashisht",
            "email": "test@test.com",
            // "password": "testing123",
            // "mobile": "1234567890",
            "university": "5f6d160e722f09292b1d0f21"
        })
        .expect(422)
        .end(function(err, res) {
          if (err) done(err);
          expect(res.body.status).to.equal("failed");
          expect(res.body.message).to.equal("Invalid Inputs passed");
          done();
        });
    });
});

describe("Test CampusDirector GET Routes", function() {
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
    server.close(() => {
        console.log("Closing server");
        connection.close()
        .then(() => {
            console.log("Closing TestDB server");
            done();
        }).catch(err => done(err));
    });
});