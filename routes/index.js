const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const { query } = require('express-validator');


router.get('/', (req,res)=>{
    
    return res.status(200).render('index', { loggedin: false,success: req.flash("success"), error: req.flash("error"), logout: req.query.logout });
});

router.get('/shop', isLoggedIn, async (req, res) => {

    let { sort, minPrice, maxPrice, discount } = req.query;

    let filter = {};

    
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

 
    if (discount === "true") {
        filter.discount = { $gt: 0 };
    }

   
    let sortOption = {};
    if (sort === "low-high") sortOption.price = 1;
    if (sort === "high-low") sortOption.price = -1;

    let products = await productModel.find(filter).sort(sortOption);

    let success = req.flash('success');

    return res.status(200).render('shop', { 
        products, 
        success, 
        user: req.user,
        loggedin: true,
        query: req.query,
        currentPath: req.path
    });
});

router.get('/cart', isLoggedIn, async (req, res) => {
    let user = await userModel
        .findById(req.user._id)
        .populate('cart.product');

   return res.status(200).render('cart', { 
    user,
    loggedin: true,
    currentPath: req.path
});
});

router.get('/addtocart/:productid', isLoggedIn, async (req, res) => {
    let user = await userModel.findById(req.user._id);

    let existingItem = user.cart.find(
        item => item.product.toString() === req.params.productid
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        user.cart.push({
            product: req.params.productid,
            quantity: 1
        });
    }

    await user.save();

    req.flash('success', 'Product added to cart');
    return res.status(302).redirect('/shop');
});

router.get('/remove/:productid', isLoggedIn, async (req, res) => {
    let user = await userModel.findById(req.user._id);

    user.cart = user.cart.filter(
        item => item.product.toString() !== req.params.productid
    );

    await user.save();

    return res.status(302).redirect('/cart');
});

router.get('/update/:productid/:action', isLoggedIn, async (req, res) => {
    let user = await userModel.findById(req.user._id);

    let item = user.cart.find(
        item => item.product.toString() === req.params.productid
    );

    if (!item) return res.redirect('/cart');

    if (req.params.action === 'increase') {
        item.quantity += 1;
    } else if (req.params.action === 'decrease') {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            user.cart = user.cart.filter(
                i => i.product.toString() !== req.params.productid
            );
        }
    }

    await user.save();
    return res.status(302).redirect('/cart');
}); 

module.exports = router;