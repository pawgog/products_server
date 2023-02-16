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
        let cart = await Cart.findOne({ "cart.productId": req.body.productId });

        if (cart) {
            const { prices } = cart.cart.find((product) => (product.productId === req.body.productId))
            cart.pricesSum.map((product) => prices.find((price) => { 
                if(price.currency === product.currency) return product.amount = product.amount + price.amount 
            }))
            cart.cart.map((product) => {
                if(product.productId === req.body.productId) return product.quantity = product.quantity + 1;
                return product;
            });

            cart = await cart.save();
            return res.status(201).send(cart);
        } else {
            const productCart = new Cart({
                cart: [{
                    productId: req.body.productId,
                    title: req.body.title,
                    prices: req.body.prices,
                    url: req.body.url,
                    imageUrl: req.body.imageUrl,
                    quantity: 1,
                }],
                pricesSum: req.body.prices
            });

            const newProductCart = await productCart.save();
            return res.status(201).json(newProductCart);
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
