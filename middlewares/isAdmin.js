module.exports = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        req.flash('error', 'Access denied');
        return res.redirect('/shop');
    }
    next();
};