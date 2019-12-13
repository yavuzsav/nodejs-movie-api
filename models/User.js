const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 25
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 80
    }
});

module.exports = mongoose.model("user", UserSchema);
