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

router.get('/:id', async (req, res) => {
    res.send(req.params.id)
})

router.post('/:id', async (req, res) => {
    const product = new Products({
        name: req.body.name,
        price: req.body.price,
        imgUrl: req.body.imgUrl
    })

    try {
        const newProduct = await product.save()
        res.status(201).json(newProduct)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.put('/:id', async (req, res) => {
    res.send(req.params.id)
})

router.delete('/:id', async (req, res) => {
    res.send(req.params.id)
})

module.exports = router;