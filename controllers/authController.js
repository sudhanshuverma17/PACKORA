const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateTokens');

module.exports.registerUser = async (req, res) => {
    try {
        let { fullname, email, password } = req.body;

        
        if (!fullname || !email || !password) {
            req.flash('error', 'All fields are required');
            return res.redirect('/');
        }
        if (req.body.password.length < 6) {
        req.flash("error", "Password must be at least 6 characters");
        return res.redirect("/");
       }
       
        email.trim().toLowerCase();

        let user = await userModel.findOne({ email });
        if (user) {
            req.flash('error', 'User already exists');
            return res.redirect('/');
        }

        // Hash password
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);

        // Create user
        user = await userModel.create({
            fullname,
            email,
            password: hash
        });

        // generate token and set cookie
        let token = generateToken(user);

        res.cookie('token', token, {
            httpOnly: true
        });

        res.redirect('/shop');

    } catch (err) {
        res.send(err.message);
    }
};


module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            req.flash('error', 'All fields are required');
            return res.redirect('/');
        }

        let user = await userModel.findOne({ email });
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/');
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/');
        }
        if (
        email === process.env.ADMIN_EMAIL && user.role !== "admin"
    ) {
        user.role = "admin";
        await user.save();
    }
        let token = generateToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000 
        });

        res.redirect('/shop');

    } catch (err) {
        res.send(err.message);
    }
};