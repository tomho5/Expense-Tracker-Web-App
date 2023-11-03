const express = require('express');
const app = express();
const cors = require('cors');
const Transaction = require('./models/Transaction.js');
const { default: mongoose } = require('mongoose');
require('dotenv').config();

app.use(cors());
app.use(express.json()); // Add this middleware to parse JSON data

app.get('/api/test', (req, res) => {
    res.json('test ok3');
});

app.post('/api/transaction', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const {name,description,datetime,price} = req.body;
    const transaction = await Transaction.create({name,description,datetime,price});
    res.json(transaction);
});

app.get('/api/transactions', async (req,res) =>{
    await mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find();
    res.json(transactions);
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
//hX3TnyBcj1RXcO3G