exports.ensureAuthenticated = async(req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'You must be logged in to access this page.');
    res.redirect('/login');
}

// Middleware to ensure user is an alumni student
exports.exportsensureAlumniStudent = async(req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'alumni-student') {
        return next();
    }
    req.flash('error_msg', 'You must be logged in as an alumni student to access this page.');
    res.redirect('/login');
}

// Middleware to ensure user is an alumni manager
exports.ensureAlumniManager = async(req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'alumni-manager') {
        return next();
    }
    req.flash('error_msg', 'You must be logged in as an alumni manager to access this page.');
    res.redirect('/login');
}

// Middleware to allow public access
exports.allowPublicAccess = async(req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/dashboard');
}