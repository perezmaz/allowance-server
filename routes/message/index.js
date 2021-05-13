const express = require('express');
const {
  routeCreate,
  routeList,
  routeDelete,
} = require('./route-process');
const isAuth = require('../../middleware/auth');

const api = express.Router();

api.post('/message', [isAuth], routeCreate);
api.get('/message', [isAuth], routeList);
api.delete('/message/:id', [isAuth], routeDelete);

module.exports = api;
