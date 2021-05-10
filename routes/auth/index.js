const express = require('express');
const { routeRefreshAccessToken } = require('./route-process');

const api = express.Router();

api.post('/refresh-token', routeRefreshAccessToken);

module.exports = api;
