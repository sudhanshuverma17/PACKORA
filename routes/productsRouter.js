const express = require('express');
const router = express.Router();

const upload = require('../config/multer-config');
const productModel = require('../models/product-model');
const isLoggedIn = require('../middlewares/isLoggedIn');
const isAdmin = require('../middlewares/isAdmin');

 router.post('/create',
    isLoggedIn,
    isAdmin,
    upload.single('image'),
    async (req, res) => {

        try {
            let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

            await productModel.create({
                image: req.file.buffer,
                name,
                price,
                discount,
                bgcolor,
                panelcolor,
                textcolor,
            });

            req.flash('success', 'Product created successfully');
           return res.status(302).redirect('/owners/admin');

        } catch (err) {
           return res.status(500).send(err.message);
        }
    }
);

router.get('/edit/:id', async (req, res) => {
    const product = await productModel.findById(req.params.id);
    return res.status(200).render('editProduct', { product });
});

router.post('/delete/:id', async (req, res) => {
    console.log("DELETE HIT");  // 🔥 debug
    await productModel.findByIdAndDelete(req.params.id);
    return res.status(302).redirect('/owners/admin');
});

router.post('/edit/:id', upload.single('image'), async (req, res) => {

    const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

    let updateData = {
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor
    };

    // update image only if new one uploaded
    if (req.file) {
        updateData.image = req.file.buffer;
    }

    await productModel.findByIdAndUpdate(req.params.id, updateData);

    req.flash("success", "Product updated successfully");
    return res.status(302).redirect('/owners/admin');
});

module.exports = router;