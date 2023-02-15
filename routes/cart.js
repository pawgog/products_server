const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

router.get('/', async (req, res) => {
    try {
        const productsCart = await Cart.find();
        res.send(productsCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', (req, res) => {
    res.send(res.productCart);
});

router.post('/:id', async (req, res) => {
    try {
        let cart = await Cart.findOne({ productId: req.body.productId });

        if (cart) {
            cart.quantity = cart.quantity + 1;
            cart = await cart.save();
            return res.status(201).send(cart);
        } else {
            const productCart = new Cart({
                productId: req.body.productId,
                title: req.body.title,
                prices: req.body.prices,
                url: req.body.url,
                imageUrl: req.body.imageUrl,
                quantity: 1,
            });

            const newProductCart = await productCart.save();
            return res.status(201).json(newProductCart);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
