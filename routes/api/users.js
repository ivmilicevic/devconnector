const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load User model
const User = require('../../models/User');

// @route    GET api/users/test
// @desc     Test users route
// @access   Public
router.get('/test', (req, res) => res.json({
    msg: 'Users works'
}));


// @route    POST api/users/register
// @desc     Register user
// @access   Public
router.post('/register', (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            // Check is user already registered
            if (user) {
                return res.status(400).json({
                    email: 'Email already exists'
                });
            }
            // If user doesn't exist proceed with registration
            else {
                const avatar = gravatar.url(req.body.email, {
                    s: 200, //size
                    r: 'pg', //rating
                    d: 'mm' //default
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });


            }
        })
});

// @route    POST api/users/login
// @desc     Login user / Return JWT
// @access   Public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ email: 'User not found!' });
            }

            // If user is found, check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        res.json({ msg: 'Success' })
                    }
                    else {
                        return res.json({ password: 'Password incorrect' });
                    }
                });
        });
});

module.exports = router;