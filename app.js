const express = require('express');
const cors = require('cors');
const path = require('path'); // Додай це
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.use(express.static('public')); 

let orders = [];

app.post('/order', (req, res) => {
    const newOrder = req.body;
    orders.push(newOrder);
    console.log("Нове замовлення:", newOrder);
    res.status(200).send({ message: "Order saved!" });
});

app.listen(port, () => {
    console.log(`Сервер працює! Відкрий: http://localhost:${port}`);
});