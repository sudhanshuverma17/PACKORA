const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports = async (req, res, next) => {
    try {
        if (!req.cookies.token) {
            req.flash('error', 'Please login first');
            return res.redirect('/');
        }

        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

        let user = await userModel
            .findById(decoded.id)
            .select('-password');

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/');
        }

        req.user = user;
        next();

    } catch (err) {
        req.flash('error', 'Session expired, login again');
        res.redirect('/');
    }
};