const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const server = require("../app");

chai.use(chaiHttp);

const tokenHeader = "x-access-token";
let token, movieId;

describe("/api/movie tests", () => {
    before((done) => {
        chai.request(server)
            .post("/authenticate")
            .send({username: "deneme1", password: "123456"})
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    describe("/GET movies", () => {
        it("it should GET all the movies", (done) => {
            chai.request(server)
                .get("/api/movies")
                .set(tokenHeader, token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    done();
                });
        });
    });

    describe("/POST movie", () => {
        it("it should POST a movie", (done) => {

            const movie = {
                title: "Test",
                director_id: "5df2096a832c6c1d6081999c",
                category: "Suç",
                country: "Türkiye",
                year: 1950,
                imdb_score: 8
            };

            chai.request(server)
                .post("/api/movies")
                .send(movie)
                .set(tokenHeader, token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title");
                    res.body.should.have.property("director_id");
                    res.body.should.have.property("category");
                    res.body.should.have.property("country");
                    res.body.should.have.property("year");
                    res.body.should.have.property("imdb_score");
                    movieId = res.body._id;
                    done();
                });
        });
    });

    describe("/GET/:movieId movie", () => {
        it("it should GET a movie by the given id", (done) => {
            chai.request(server)
                .get("/api/movies/" + movieId)
                .set(tokenHeader, token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title");
                    res.body.should.have.property("director_id");
                    res.body.should.have.property("category");
                    res.body.should.have.property("country");
                    res.body.should.have.property("year");
                    res.body.should.have.property("imdb_score");
                    res.body.should.have.property("_id").eql(movieId);
                    done();
                });
        });
    });

    describe("/PUT/movieId movie", () => {
        it("it should UPDATE a mobe given by id", (done) => {

            const movie = {
                title: "updatedTest",
                director_id: "5df2096a832c6c1d6081999c",
                category: "Komedi",
                country: "Fransa",
                year: 1970,
                imdb_score: 9
            };

            chai.request(server)
                .put("/api/movies/" + movieId)
                .send(movie)
                .set(tokenHeader, token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title").eql(movie.title);
                    res.body.should.have.property("director_id").eql(movie.director_id);
                    res.body.should.have.property("category").eql(movie.category);
                    res.body.should.have.property("country").eql(movie.country);
                    res.body.should.have.property("year").eql(movie.year);
                    res.body.should.have.property("imdb_score").eql(movie.imdb_score);
                    done();
                });
        });
    });

    describe("/DELETE/movieId movie", () => {
        it("it should DELETE a movie given by id", (done) => {
            chai.request(server)
                .delete("/api/movies/" + movieId)
                .set(tokenHeader, token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("status").eql(true);
                    done();
                });
        });
    });
});