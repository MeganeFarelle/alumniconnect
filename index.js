const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mustache = require('mustache-express');
const passport = require('passport');
const connectMongo = require('connect-mongo');

const app = express();
const port = process.env.PORT || 3000;

// Import your authentication and authorization
// Modify this based on your setup
const authorization = require('./config/authorization'); // Modify this based on your setup

// Connect to MongoDB using the MongoURI
const MongoURI = 'mongodb+srv://Megane:selenagomez1233434455555@atlascluster.pumyrrb.mongodb.net/YourDatabase?retryWrites=true&w=majority';
mongoose.connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Atlas Connected...'))
    .catch(err => console.log(err))

app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.use(bodyParser.urlencoded({ extended: false }))

// Create a new MongoStore instance
console.log("mongoose.connection.getClient", mongoose.connection.getClient());

const MongoStore = new connectMongo({
    mongoUrl: "mongodb+srv://Megane:selenagomez1233434455555@atlascluster.pumyrrb.mongodb.net"
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: MongoStore
}));

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     res.locals.message = req.flash('message');
//     next();
// });

// Serve static files from the 'public' directory
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Listen on the specified port
app.listen(port, () => {
    console.log(`Server started on port ${port}. Ctrl^c to quit.`);
});

// Include your user and goal routes
const usersRoutes = require('./routes/users');
const routesRoutes = require('./routes/routes'); // Modify this based on your route setup

app.use('/', usersRoutes);
app.use('/', routesRoutes); // Apply authorization middleware for route routes