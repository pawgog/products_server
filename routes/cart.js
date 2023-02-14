const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

router.get('/cart', async (req, res) => {
    try {
        const productsCart = await Cart.find();
        res.send(productsCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/cart/:id', getProductsCart, (req, res) => {
    res.send(res.productCart);
})

router.post('/cart/:id', async (req, res) => {
    console.log('req', req.body);
    const productCart = new Cart({
        title: req.body.title,
        prices: req.body.prices,
        url: req.body.url,
        imgUrl: req.body.imgUrl
    });

    try {
        const newProductCart = await productCart.save();
        res.status(201).json(newProductCart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

async function getProductsCart(req, res, next) {
    let product;
    try {
        product = await Cart.findById(req.params.id);
        if (product === null) {
            return res.status(404).json({ message: 'Can not find product' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.product = product;
    next()
}

module.exports = router;