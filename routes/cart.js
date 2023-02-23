const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

const cartArray = (productId, title, prices, url, imageUrl) => ({
    productId,
    title,
    prices,
    url,
    imageUrl,
    quantity: 1,
});

const calculatePrices = (cart, productId) => {
    const { prices } = cart.cart.find((product) => (product.productId === productId))
    return cart.pricesSum.map((product) => prices.find((price) => { 
        if(price.currency === product.currency) return product.amount = product.amount + price.amount 
    }))
}

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
    const { productId, prices, title, url, imageUrl } = req.body;
    try {
        const existCart = await Cart.findOne();
        let cart = await Cart.findOne({ "cart.productId": productId });

        if (existCart) {
            if (cart) {
                calculatePrices(cart, productId);
                cart.cart.map((product) => {
                    if(product.productId === productId) return product.quantity = product.quantity + 1;
                    return product;
                });

                cart.markModified('pricesSum');
                cart = await cart.save();
                return res.status(201).send(cart);
            } else {
                existCart.cart.push(cartArray(productId, title, prices, url, imageUrl));
                calculatePrices(existCart, productId);

                existCart.markModified('pricesSum');
                const updateProductCart = await existCart.save();
                return res.status(201).json(updateProductCart);
            }
        } else {
            const productCart = new Cart({
                cart: [cartArray(productId, title, prices, url, imageUrl)],
                pricesSum: prices
            });

            const newProductCart = await productCart.save();
            return res.status(201).json(newProductCart);
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
