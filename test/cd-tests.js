const request = require('supertest');
const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect

const server = require('../index');

// afterEach((done) => {
//     connection.dropAll();
//     done();
// });

describe("CampusDirector Routes", () => {

    describe("Test POST Routes", () => {
        it("Signup CDs with wrong input", (done) => {
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
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(422);
              expect(res.body.status).to.equal("failed");
              expect(res.body.message).to.contain('triggered the error!!');
              done();
            });
        });
    
        it("Signup CDs with correct input", (done) => {
            request(server)
            .post("/api/v1/campusDirector/signup")
            .send({
                "firstName": "test_Raghav",
                "lastName": "test_Vashisht",
                "email": "test2@test.com",
                "password": "testing123",
                "mobile": "1234567890",
                "university": "5f6d160e722f09292b1d0f21"
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(201);
              expect(res.body.status).to.equal("success");
              expect(res.body.user._id).to.not.be.undefined;
              expect(res.body.user.password).to.be.undefined;
              expect(res.body.token).to.not.be.undefined;
              done();
            });
        });
    
        it("Login CD with incomplete input", (done) => {
            request(server)
            .post("/api/v1/campusDirector/login")
            .send({
                "email": "test2@test.com",
                // "password": "testing123",
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(422);
              expect(res.body.status).to.equal("failed");
              expect(res.body.message).to.contain('triggered the error!!');
              done();
            });
        });
    
        it("Login CD with incorrect input", (done) => {
            request(server)
            .post("/api/v1/campusDirector/login")
            .send({
                "email": "test2@test.com",
                "password": "ThIs iS a WrOnG PaSsWoRd",
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(403);
              expect(res.body.status).to.equal("failed");
              expect(res.body.message).to.equal("Incorrect password entered.");
              done();
            });
        });
    
        it("Login CD with correct input", (done) => {
            request(server)
            .post("/api/v1/campusDirector/login")
            .send({
                "email": "test2@test.com",
                "password": "testing123",
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(200);
              expect(res.body.status).to.equal("success");
              expect(res.body.user._id).to.not.be.undefined;
              expect(res.body.user.firstName).to.not.be.undefined;
              expect(res.body.user.university).to.not.be.undefined;
              expect(res.body.user.email).to.not.be.undefined;
              expect(res.body.user.password).to.be.undefined;
              expect(res.body.token).to.not.be.undefined;
              done();
            });
        });
    
    });
    
    describe("Test GET Routes", () => {
        it("it should get all CDs", (done) => {
            request(server)
            .get("/api/v1/campusDirector/get/all")
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(200);
              expect(res.body.status).to.equal("success");
              done();
            });
        });
    });
    


});


