const express = require('express');
const router = express.Router();
const Products = require('../models/products');

router.get('/', async (req, res) => {
    try {
        const products = await Products.find();
        res.send(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/:id', getProducts, (req, res) => {
    res.send(res.product);
})

router.post('/:id', async (req, res) => {
    const product = new Products({
        name: req.body.name,
        price: req.body.price,
        imgUrl: req.body.imgUrl
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.patch('/:id', getProducts, async (req, res) => {
    if(req.body.name !== null) {
        res.product.name = req.body.name;
    }
    if(req.body.price !== null) {
        res.product.price = req.body.price;
    }
    if(req.body.imgUrl !== null) {
        res.product.imgUrl = req.body.imgUrl;
    }
    try {
        const updateProduct = await res.product.save();
        res.json(updateProduct)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.delete('/:id', getProducts, async (req, res) => {
    try {
        await res.product.remove();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

async function getProducts(req, res, next) {
    let product;
    try {
        product = await Products.findById(req.params.id);
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