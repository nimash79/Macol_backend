const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require("mongoose");

const { PORT, MONGO } = process.env;

const { userRoutes, accountRoutes, deviceRoutes, hardwareRoutes, reportRoutes } = require('./routes');
const { apiMiddleWare, userMiddleWare, hardwareMiddleWare } = require('./middlewares/api_middleware');
const { authRoutes } = require('./utils/constants');


const app = express();

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.json({ extended: false }));
app.use(apiMiddleWare);
app.use(authRoutes, userMiddleWare);

app.use('/api/accounts', accountRoutes);
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/hardware', hardwareMiddleWare, hardwareRoutes);
app.use('/api/reports', reportRoutes);
app.use((req, res) => res.sendResponse('api not found', 404));

app.listen(PORT, async () => {
    console.log(`Server started at port ${PORT}`);
    await mongoose.connect(MONGO);
    console.log('connected to database');
})