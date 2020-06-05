const app = require("../app");
const URL = 'http://localhost:2020/api/v1';
const chai = require("chai");
let should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

describe("/GET API methods", () => {
    it("generates token for the user", done => {
        chai
        .request(URL)
        .get('/auth')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            done();
        });
    });

    it("Forbid access to station info by id", done => {
        chai
        .request(URL)
        .get('/station/200')
        .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            done();
        });
    });

    it("Grant access to station info by id", done => {
    chai
      .request(URL)
      .get('/auth')
      .end((err, res) => {
        token = res.body.token;

        chai
        .request(URL)
        .get('/station/200')
        .set({ "Authorization": `Bearer ${token}` })
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('station_info');
            res.body.should.have.property('user');
            done();
        });
    });
    });


    it("Forbid access to Riders count", done => {
        chai
            .request(URL)
            .get('/station/riders/238/2019-06-27')
            .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            done();
            });
    });

    it("Grant access to riders count", done => {
        chai
          .request(URL)
          .get('/auth')
          .end((err, res) => {
            token = res.body.token;
    
            chai
            .request(URL)
            .get('/station/riders/238/2019-06-27')
            .set({ "Authorization": `Bearer ${token}` })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('Number of riders');
                res.body.should.have.property('user');
                done();
            });
        });
    });

    it("Forbid access to last 20 trip", done => {
        chai
            .request(URL)
            .get('/station/last20/238/2019-06-27')
            .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            done();
            });
    });

    it("Grant access to last 20 trip", done => {
        chai
          .request(URL)
          .get('/auth')
          .end((err, res) => {
            token = res.body.token;
    
            chai
            .request(URL)
            .get('/station/last20/238/2019-06-27')
            .set({ "Authorization": `Bearer ${token}` })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('last 20');
                res.body.should.have.property('user');
                done();
            });
        });
    });
    
});