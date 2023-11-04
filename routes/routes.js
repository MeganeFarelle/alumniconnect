const express = require('express');
const controller = require('../controllers/controller');
const authentication = require('../config/authentication'); // Correct the require statement
const router = express.Router();

router.get('/', async(req, res) => {
    console.log("home page")
    res.render('home', {
        'heading': 'Welcome to the Alumni Platform'
    });
});

router.get('/goals', controller.viewEvent);
router.get('/goals/:id', controller.viewEvent);

console.log(authentication, authentication.ensureAuthenticated)
router.get('/events/add', authentication.ensureAuthenticated, controller.createEvent); // Fix the middleware
router.post('/events/add', authentication.ensureAuthenticated, controller.post_event); // Fix the middleware

router.get('/events/edit/:id', authentication.ensureAuthenticated, controller.editEvent); // Fix the middleware
router.post('/events/edit/:id', authentication.ensureAuthenticated, controller.updateEvent); // Fix the middleware

router.get('/delete/:id', authentication.ensureAuthenticated, controller.deleteEvent); // Fix the middleware

router.get('/logout', controller.logout);

router.get('/manager', authentication.ensureAuthenticated, controller.alumniManager); // Fix the middleware

router.get('/about', authentication.allowPublicAccess, controller.about);

router.post('/search', authentication.ensureAuthenticated, controller.search);

// Handle removing events and marking events as completed
router.get('/events/remove/:id', authentication.ensureAuthenticated, controller.deleteEvent); // Fix the middleware
//router.get('/completed/:id', authentication.ensureAuthenticated, controller.markComplete); // Fix the middleware
router.use(function(req, res) {
    res.status(404);
    res.render('404');
});

router.use(function(err, req, res, next) {
    res.status(500);
    res.render('500');
});
module.exports = router;