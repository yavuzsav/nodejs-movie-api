const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const wrongUserNameOrPassword = {
    status: false,
    message: "Authentication failed, invalid username or password"
};

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {title: 'Express'});
});

router.post("/register", (req, res) => {
    const {username, password} = req.body;

    bcrypt.hash(password, 10).then((hash) => {

        new User({
            username,
            password: hash
        }).save()
            .then(user => res.json(user))
            .catch(err => res.json(err));

    });

});

router.post("/authenticate", (req, res) => {
    const {username, password} = req.body;

    User.findOne({
        username
    }, (err, user) => {
        if (err)
            throw err;

        if (!user)
            res.json(wrongUserNameOrPassword);
        else {
            bcrypt.compare(password, user.password).then((result) => {
                if (!result)
                    res.json(wrongUserNameOrPassword);
                else {
                   const payload = {
                       username
                   }
                   const token = jwt.sign(payload, req.app.get("api_secret_key"), {expiresIn: 720});

                   res.json({
                       status: true,
                       token
                   });
                }
            });
        }
    })
});

module.exports = router;
