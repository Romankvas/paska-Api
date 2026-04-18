require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


mongoose.connect("mongodb+srv://romankvas27b_db_user:WG6hmQdzC35jmyV2@cluster0.9xwq8ea.mongodb.net/?appName=Cluster0")
    .then(() => console.log('✅ Успішно підключено до MongoDB Atlas!'))
    .catch(err => console.error('❌ Помилка підключення:', err));

const orderSchema = new mongoose.Schema({
    phone: String,
    items: Array,
    total: Number,
    date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// 3. ОНОВЛЕНИЙ РОУТ ДЛЯ ЗАМОВЛЕННЯ
app.post('/order', async (req, res) => {
    try {
        const newOrder = new Order({
            phone: req.body.phone,
            items: req.body.items,
            total: req.body.total
        });

        await newOrder.save(); 
        console.log("Замовлення збережено в БД:", newOrder);
        res.status(200).send({ message: "Замовлення збережено!" });
    } catch (error) {
        res.status(500).send({ message: "Помилка сервера", error });
    }
});

app.listen(3000, () => console.log('Сервер на http://localhost:3000'));