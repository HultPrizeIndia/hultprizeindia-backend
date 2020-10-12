const request = require('supertest');
const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect

const server = require('../index');

// afterEach((done) => {
//     connection.dropAll();
//     done();
// });
describe("Referral Routes", () => {

    describe("Test GET Routes", () => {
        it("it should get all referrals", (done) => {
            request(server)
                .get("/api/v1/referral/get/all")
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body.status).to.equal("success");
                    done();
                });
        });
    });
    
    describe("Test POST Routes", () => {
        it("Create referral with correct input", (done) => {
            request(server)
                .post("/api/v1/referral/create")
                .set('Authorization', `Bearer ${process.env.TEST_CD_TOKEN}`)
                .send({
                    "description": "It a test referral",
                    "name": "Test_Verma",
                    "email": "shivam@test.com",
                    "mobile": "9953798220"
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body.status).to.equal("success");
                    expect(res.body.referral).to.not.be.undefined;
                    done();
                });
        });
    
        it("Create referral with incorrect input", (done) => {
            request(server)
                .post("/api/v1/referral/create")
                .set('Authorization', `Bearer ${process.env.TEST_CD_TOKEN}`)
                .send({
                    "description": "It a test referral",
                    // "name": "Test_Verma",
                    // "email": "shivam@test.com",
                    "mobile": "9953798220"
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.status).to.equal(422);
                    expect(res.body.status).to.equal("failed");
                    done();
                });
        });

        it("Create referral with incorrect token", (done) => {
            request(server)
                .post("/api/v1/referral/create")
                .set('Authorization', `Bearer THISISAWRONGJWTTOKEN`)
                .send({
                    "description": "It a test referral",
                    "name": "Test_Verma",
                    "email": "shivam@test.com",
                    "mobile": "9953798220"
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.status).to.equal(403);
                    expect(res.body.status).to.equal("failed");
                    done();
                });
        });

        it("Create referral without token", (done) => {
            request(server)
                .post("/api/v1/referral/create")
                // .set('Authorization', `Bearer ${process.env.TEST_CD_TOKEN}`)
                .send({
                    "description": "It a test referral",
                    "name": "Test_Verma",
                    "email": "shivam@test.com",
                    "mobile": "9953798220"
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.status).to.equal(403);
                    expect(res.body.status).to.equal("failed");
                    done();
                });
        });

    });
    
    describe("Test DELETE Routes", () => {
        it("it should delete all referrals", (done) => {
            request(server)
                .delete("/api/v1/referral/deleteAll")
                .set('Authorization', `Bearer ${process.env.TEST_ADMIN_TOKEN}`)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body.status).to.equal("success");
                    done();
                });
        });
    });


});
