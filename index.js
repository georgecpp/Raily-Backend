const express = require('express');
const app = express();
const dotenv = require('dotenv');
// const cors = require('cors');
const mongoose = require('mongoose');


// Import routes
const homeRoute = require('./routes/home');
const authRoute = require('./routes/auth');


// environment config
dotenv.config();


// Connect to DB
mongoose.connect(process.env.DB_CONNECT, () => {
    console.log('connected to db!');
});


// middleware
app.use(express.json());
// app.use(cors());


// Route Middlewares
app.use('/', homeRoute);
app.use('/auth', authRoute);


app.listen(process.env.PORT || 6000, () => console.log("Server Up and running!"));