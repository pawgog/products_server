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

const calculatePrices = (cartPrices) => {
    const calcObject = {};
    cartPrices.cart.map(obj => obj.prices.forEach((item) => {
        if (!calcObject[item.currency]) {
            calcObject[item.currency] = item.amount * obj.quantity;
        } else {
            calcObject[item.currency] = Number(calcObject[item.currency]) + Number(item.amount * obj.quantity);
        }
    }));
    const newSumArray = [];
    for (let key in calcObject) {
        newSumArray.push({
            amount: Number(calcObject[key].toFixed(2)),
            currency: key
        })
    }
    cartPrices.pricesSum = newSumArray;
    return cartPrices;
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
                    if (product.productId === productId) return product.quantity = product.quantity + 1;
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

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const existCart = await Cart.findOne();
        const filtered = existCart.cart.filter((item) => item.productId !== Number(id));
        existCart.cart = filtered;
        calculatePrices(existCart)

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
