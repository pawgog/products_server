const express = require('express');
const app = express();
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(`${process.env.DB_URL}/products`);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connect to DB'));

app.use(express.json());

const productsRouter = require('./routes/products');
app.use('products', productsRouter);

app.listen(3000, () => console.log('server is starting'));
