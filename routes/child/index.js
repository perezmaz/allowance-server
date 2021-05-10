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

api.post('/child', [isAuth, isParent], routeCreate);
api.get('/child', [isAuth, isParent], routeList);
api.get('/child/:id', [isAuth, isParent], routeEdit);
api.put('/child/:id', [isAuth, isParent], routeUpdate);
api.delete('/child/:id', [isAuth, isParent], routeDelete);

module.exports = api;
