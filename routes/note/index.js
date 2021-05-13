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

api.post('/note', [isAuth, isParent], routeCreate);
api.get('/note', [isAuth, isParent], routeList);
api.get('/note/:id', [isAuth, isParent], routeEdit);
api.put('/note/:id', [isAuth, isParent], routeUpdate);
api.delete('/note/:id', [isAuth, isParent], routeDelete);

module.exports = api;
