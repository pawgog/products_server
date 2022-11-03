const express = require('express');
const router = express.Router();
const Products = require('../models/products');

router.get('/', async (req, res) => {
    try {
        const products = await Products.find();
        res.send(products);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;