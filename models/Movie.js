const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    director_id: Schema.Types.ObjectId,
    title: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 1
    },
    category: {
        type: String,
        required: true,
        maxlength: 40,
        minlength: 1
    },
    country: {
        type: String,
        required: true,
        maxlength: 40,
        minlength: 1
    },
    year: {
        type: Number,
        min:1800,
        max: new Date().getFullYear()
    },
    imdb_score: {
        type: Number,
        max: 10,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("movie", MovieSchema);