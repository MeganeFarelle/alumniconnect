const express = require('express');
const passport = require('passport');
const User = require("../models/user");
const Goal = require("../models/goal"); // Changed Event to Goal
const bcrypt = require('bcrypt');

// Render the homepage
exports.welcome = async(req, res) => {
    console.log("home page")
    res.render('home', {
        'heading': 'Welcome to the Alumni Platform'
    });
}

// Render the login page
exports.user_login = function(req, res) {
    res.render('login', {
        'heading': 'Login',
        'alert1': res.locals.success_msg,
        'alert2': res.locals.error_msg,
        'alert3': res.locals.error
    });
}

// Handle user registration
exports.user_signup = function(req, res) {
    const { username, email, password, password2 } = req.body;
    console.log(req.body);
    let errors = [];
    console.log(' Username ' + username + ' email :' + email + ' pass:' + password);

    if (!username || !email || !password || !password2) {
        errors.push({ msg: "Make sure to fill in all fields" });
    } else if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters long' });
    } else if (password !== password2) {
        errors.push({ msg: "Passwords do not match" });
    } else {
        console.log('');
    }

    if (errors.length > 0) {
        res.render('signup', {
            'heading': 'Sign Up',
            'errors': errors
        });
    } else {
        User.findOne({ email: email }).exec((err, user) => {
            console.log(user);
            if (user) {
                errors.push({ msg: 'Email already in use. Please use another email address.' });
                res.render('signup', {
                    'heading': 'Sign Up',
                    'errors': errors
                });
            } else {
                const newUser = new User({
                    username: username,
                    email: email,
                    password: password
                });

                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then((value) => {
                                console.log(value);
                                req.flash('success_msg', 'Welcome to the Alumni Platform');
                                res.redirect('/login');
                            })
                            .catch(value => console.log(value));
                    })
                );
            }
        });
    }
};

// Handle user login
exports.user_post_login = function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next);
};

// Render the user dashboard
exports.dashboard = async(req, res) => {
    try {
        const date = new Date();

        function convertDate(date) {
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth() + 1).toString();
            var dd = date.getDate().toString();

            var mmChars = mm.split('');
            var ddChars = dd.split('');

            return (ddChars[1] ? dd : "0" + ddChars[0]) + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + yyyy;
        }

        convertDate(date);
        const goals = await Goal.find({ alumni: req.user }).lean(); // Changed Event to Goal
        res.render('dashboard', {
            'heading': 'Dashboard',
            'date': convertDate(date),
            user: req.user.username,
            'alert': res.locals.message,
            'events': goals, // Changed events to goals
        });
    } catch (err) {
        console.error(err);
        res.render('500');
    }
};

exports.afterSignup = function(req, res) {

        res.render('afterSignup', {

        });
    }
    // Render the event creation page
exports.createEvent = function(req, res) {
    res.render('createEvent', {
        'heading': 'Create Event',
        user: req.user.username,
    });
};

// Handle creating a new event
exports.post_event = async(req, res) => {
    const { title, description, category, date, location } = req.body;

    if (!title || !description || !category || !date || !location) {
        res.status(400).send("All fields are required");
        return;
    }

    try {
        req.body.alumni = req.user.id;
        await Goal.create(req.body); // Changed Event to Goal
        req.flash('message', 'Event created successfully');
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('500');
    }
};

// Render the event page
exports.viewEvent = async(req, res) => {
    console.log("viewEvent")
    try {
        const goal = await Goal.findOne({ _id: req.params.id }); // Changed Event to Goal
        res.render('event', {
            'heading': 'Event Details',
            user: "req.user.username",
            event: "goal", // Changed event to goal
        });
    } catch (err) {
        console.error(err);
        res.render('500');
    }
};

// Handle editing an event
exports.editEvent = async(req, res) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.id }); // Changed Event to Goal
        res.render('editEvent', {
            'heading': 'Edit Event',
            user: req.user.username,
            event: goal, // Changed event to goal
        });
    } catch (err) {
        console.error(err);
        res.render('500');
    }
};

// Update an event
exports.updateEvent = async(req, res) => {
    try {
        let goal = await Goal.findById(req.params.id); // Changed Event to Goal

        goal = await Goal.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        });
        req.flash('message', 'Event updated successfully');
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('500');
    }
};

// Delete an event
// Delete an event
exports.deleteEvent = async(req, res) => {
    try {
        await Goal.deleteOne({ _id: req.params.id }); // Changed Event to Goal
        req.flash('message', 'Event has been removed');
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('500');
    }
};

// Logout user
exports.logout = function(req, res) {
    req.logout();
    req.flash('success_msg', 'Logged out');
    res.redirect('/login');
};

// Render the search page
exports.search = async(req, res) => {
    try {
        const goals = await Goal.find({ alumni: req.user, title: req.body.search }).lean(); // Changed Event to Goal
        res.render('search', {
            'heading': 'Search Events',
            user: req.user.username,
            'alert': res.locals.message,
            'events': goals, // Changed events to goals
        });
    } catch (err) {
        console.error(err);
        res.render('500');
    }
};

// Render the alumni manager page
exports.alumniManager = function(req, res) {
    res.render('alumniManager', {
        'heading': 'Alumni Manager',
    });
};

// Render the user registration page
exports.registerUser = function(req, res) {
    res.render('registerUser', {
        'heading': 'Register User',
    });
};

// Render the about page
exports.about = function(req, res) {
    res.render('about', {
        'heading': 'About Us',
    });
};

module.exports = exports;