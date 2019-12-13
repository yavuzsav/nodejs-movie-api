const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect("mongodb://localhost:27017/movie-api", {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log("MongoDB Connected"))
        .catch((err) => console.log("MongoDB Error", err));

    mongoose.Promise = global.Promise;
};