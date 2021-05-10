const express = require('express');
const {
  routeRegister,
  routeLogin,
  routeEdit,
  routeUpdate,
  routeForgot,
  routeActivate,
} = require('./route-process');
const isAuth = require('../../middleware/auth');

const api = express.Router();

api.post('/register', routeRegister);
api.post('/login', routeLogin);
api.post('/forgot', routeForgot);
api.post('/activate', routeActivate);
api.get('/user/:id', [isAuth], routeEdit);
api.put('/user/:id', [isAuth], routeUpdate);

module.exports = api;
