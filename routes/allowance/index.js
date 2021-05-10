const express = require('express');
const {
  routeCreate,
  routeEdit,
  routeList,
  routeUpdate,
  routeDelete,
  routeFindAmount,
} = require('./route-process');
const isAuth = require('../../middleware/auth');
const isParent = require('../../middleware/parent');

const api = express.Router();

api.post('/allowance', [isAuth, isParent], routeCreate);
api.get('/allowance', [isAuth, isParent], routeList);
api.get('/allowance/findAmount', [isAuth, isParent], routeFindAmount);
api.get('/allowance/:id', [isAuth, isParent], routeEdit);
api.put('/allowance/:id', [isAuth, isParent], routeUpdate);
api.delete('/allowance/:id', [isAuth, isParent], routeDelete);

module.exports = api;
