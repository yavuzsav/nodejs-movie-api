const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Director = require("../models/Director");

const directorNotFound = {error: {message: "The director was not found.", code: 99}};

router.get("/", (req, res) => {
    Director.aggregate([
        {
            $lookup: {
                from: "movies",
                localField: "_id",
                foreignField: "director_id",
                as: "movies"
            }
        },
        {
            $unwind: {
                path: "$movies",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    _id: "$_id",
                    name: "$name",
                    surname: "$surname",
                    bio: "$bio"
                },
                movies: {
                    $push: "$movies"
                }
            }
        },
        {
            $project: {
                _id: "$_id._id",
                name: "$_id.name",
                surname: "$_id.surname",
                bio: "$_id.bio",
                movies: "$movies"
            }
        }
    ])
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

router.get("/:directorId", (req, res) => {
    Director.aggregate([
        {
            $match: {
                "_id": mongoose.Types.ObjectId(req.params.directorId)
            }
        },
        {
            $lookup: {
                from: "movies",
                localField: "_id",
                foreignField: "director_id",
                as: "movies"
            }
        },
        {
            $unwind: {
                path: "$movies",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    _id: "$_id",
                    name: "$name",
                    surname: "$surname",
                    bio: "$bio"
                },
                movies: {
                    $push: "$movies"
                }
            }
        },
        {
            $project: {
                _id: "$_id._id",
                name: "$_id.name",
                surname: "$_id.surname",
                bio: "$_id.bio",
                movies: "$movies"
            }
        }
    ])
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

router.post("/", (req, res) => {
    new Director(req.body).save()
        .then(data => res.json(data))
        .catch(err => res.json(err))
});

router.put("/:directorId", (req, res) => {
    Director.findByIdAndUpdate(req.params.directorId, req.body, {new: true})
        .then(director => {
            if (!director)
                throw (directorNotFound);

            res.json(director);
        })
        .catch(err => res.json(err));
});

router.delete("/:directorId", (req, res) => {
    Director.findByIdAndRemove(req.params.directorId)
        .then(director => {
            if (!director)
                throw (directorNotFound);

            res.json(director);
        })
        .catch(err => res.json(err));
});

module.exports = router;