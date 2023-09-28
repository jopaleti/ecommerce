require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoute = require('./routes/user.js');
const authRoute = require('./routes/auth.js');
const productRoute = require('./routes/product.js');
const orderRoute = require('./routes/order.js')
const cartRoute = require('./routes/cart.js')

// Middleware configuration
app.use(express.urlencoded({extended: false}));
app.use(express.json())
// Mongoose connection
mongoose.connect('mongodb://localhost:27017/info', 
    {useNewUrlParser: true, useUnifiedTopology: true})
        .then(res => console.log('Database Connected'))
        .catch(err => console.log(err))

// Using Router middleware
app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/product', productRoute)
app.use('/api/order', orderRoute)
app.use('/api/cart', cartRoute)

app.listen(process.env.PORT||4000, ()=>{
    console.log('Server is running on port 4000');
})