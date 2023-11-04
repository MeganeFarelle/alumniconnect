const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const authentication = require('../config/authentication');

router.get('/login', controller.user_login);

router.get('/signup', async(req, res) => {
    res.render('signup');
});

// Define a valid callback function for your GET requests
router.get('/example', (req, res) => {
    // Add your route handling logic here
    // For example:
    res.send('This is an example route.');
});

router.post('/signup', (req, res) => {
    // Add your route handling logic here
    controller.afterSignup(req, res); // You might want to use your controller logic here
});



router.post('/login', controller.user_post_login);

module.exports = router;