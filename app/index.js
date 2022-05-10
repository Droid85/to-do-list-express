const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const home = require('./api/home/controller');

const app = express();

app.use((req, res, next) => {
    console.log(`Request: {
        content-type: ${req.get('Content-Type')}
        url: ${req.url},
        method: ${req.method}
    }`);
    next();
});

app.use(bodyParser());

app.use('/', home);

app.use(errors());

module.exports = app;
