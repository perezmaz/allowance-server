const express = require('express');
const {
  routeCreate,
  routeEdit,
  routeList,
  routeUpdate,
  routeDelete,
} = require('./route-process');
const isAuth = require('../../middleware/auth');
const isParent = require('../../middleware/parent');

const api = express.Router();

api.post('/category', [isAuth, isParent], routeCreate);
api.get('/category', [isAuth, isParent], routeList);
api.get('/category/:id', [isAuth, isParent], routeEdit);
api.put('/category/:id', [isAuth, isParent], routeUpdate);
api.delete('/category/:id', [isAuth, isParent], routeDelete);

module.exports = api;
