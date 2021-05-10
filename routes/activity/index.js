const express = require('express');
const {
  routeCreate,
  routeEdit,
  routeList,
  routeUpdate,
  routeDelete,
  routeFindPercentLeft,
} = require('./route-process');
const isAuth = require('../../middleware/auth');
const isParent = require('../../middleware/parent');

const api = express.Router();

api.post('/activity', [isAuth, isParent], routeCreate);
api.get('/activity', [isAuth], routeList);
api.get('/activity/findPercentLeft', [isAuth, isParent], routeFindPercentLeft);
api.get('/activity/:id', [isAuth, isParent], routeEdit);
api.put('/activity/:id', [isAuth, isParent], routeUpdate);
api.delete('/activity/:id', [isAuth, isParent], routeDelete);

module.exports = api;
