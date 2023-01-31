const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 3210;

require('dotenv').config();

mongoose.connect(`${process.env.DB_URL}/products`);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connect to DB'));

app.use(cors());
app.use(express.json());

const productsRouter = require('./routes/products');
app.use('/products', productsRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`)
})