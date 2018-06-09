const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load profile and user model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Load input validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// @route    GET api/profile/test
// @desc     Test profile route
// @access   Public
router.get('/test', (req, res) => res.json({ msg: 'Profile works' }));

// @route    GET api/profile
// @desc     Get current logged in user's profile
// @access   Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route    GET api/profile/all
// @desc     Get all profiles
// @access   Public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noprofile = 'There are no profiles';
                return res.status(404).json(errors);
            }

            res.json(profiles);
        })
        .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
});

// @route    GET api/profile/handle/:handle
// @desc     Get profile by handle
// @access   Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route    POST api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({ profile: 'There is no profile for this user' }));
});


// @route    POST api/profile
// @desc     Create or edit user profile
// @access   Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // Get fields from request
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // Skills are sent as CSV, they need to be separated into array before use
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }
    // Social - usernames are sent individually in request, but will later be stored in object
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.youtube = req.body.youtube;

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                // If profile already exists update it
                Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
                    .then(profile => res.json(profile));
            }
            else {
                // Profile doesn't exist, create new

                // Check if handle exists
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        // Check is username available
                        if (profile) {
                            errors.handle = 'That handle is already in use';
                            res.status(400).json(errors);
                        }

                        // Save profile
                        new Profile(profileFields).save().then(profile => res.json(profile));
                    })
            }
        })
});

// @route    POST api/profile/experience
// @desc     Add experience to profile
// @access   Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            // Add new experience object to start of array
            profile.experience.unshift(newExp);

            profile.save()
                .then(profile => res.json(profile));
        });
});


// @route    POST api/profile/education
// @desc     Add education to profile
// @access   Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            // Add new education object to start of array
            profile.education.unshift(newEdu);

            profile.save()
                .then(profile => res.json(profile));
        });
});

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            // Find index of experience in array
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id);

            // Delete experience by splicing array at removeIndex and deleting 1 item
            profile.experience.splice(removeIndex, 1);

            profile.save()
                .then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            // Find index of education in array
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id);

            // Delete experience by splicing array at removeIndex and deleting 1 item
            profile.education.splice(removeIndex, 1);

            profile.save()
                .then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});

module.exports = router;