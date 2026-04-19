const express = require('express');
const router = express.Router();
const productModel = require('../models/product-model');
const isLoggedIn = require('../middlewares/isLoggedIn');
const isAdmin = require('../middlewares/isAdmin');

router.get('/admin',isLoggedIn ,isAdmin, async (req, res) => {
    const products = await productModel.find();
    return res.status(200).render('admin', { 
    products, 
    success: req.flash("success") 
});
});

module.exports = router;