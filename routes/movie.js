const express = require('express');
const router = express.Router();

const Movie = require("../models/Movie");

const movieNotFound =  {error: {message: "The movie was not found.", code: 99}};

router.get("/", (req, res) => {
    const promise = Movie.aggregate([
        {
            $lookup: {
                from: "directors",
                localField: "director_id",
                foreignField: "_id",
                as: "director"
            }
        },
        {
            $unwind: "$director"
        }
    ])
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

router.get("/top10", (req, res) => {
    Movie.find({}).limit(10).sort({imdb_score: -1})
        .then(movies => res.json(movies))
        .catch(err => res.json(err));
});

router.get("/:movieId", (req, res) => {
    const promise = Movie.findById(req.params.movieId)
        .then(movie => {
            if (!movie)
                throw (movieNotFound);
            res.json(movie)
        })
        .catch(err => res.status(404).json(err));
});

router.post('/', (req, res, next) => {
    const movie = new Movie(req.body);
    const promise = movie.save()
        .then((data) => res.json(data))
        .catch((err) => res.json(err));
});

router.put("/:movieId", (req, res) => {
    Movie.findByIdAndUpdate(req.params.movieId, req.body, { new: true})
        .then(movie => {
            if (!movie)
                throw (movieNotFound);

            res.json(movie);
        })
        .catch(err => res.status(404).json(err));
});

router.delete("/:movieId", (req, res) => {
   Movie.findByIdAndRemove(req.params.movieId)
       .then(movie => {
           if (!movie)
               throw (movieNotFound);

           res.json({status : true});
       })
       .catch(err => res.status(404).json(err));
});

router.get("/between/:startYear/:endYear", (req, res) => {
    const { startYear, endYear } = req.params;
    Movie.find({
        year: { "$gte":parseInt(startYear), "$lte": parseInt(endYear)}
    })
        .then(movies => res.json(movies))
        .catch(err => res.json(err));
});

module.exports = router;
