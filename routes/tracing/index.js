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

api.post('/tracing', [isAuth, isParent], routeCreate);
api.get('/tracing', [isAuth], routeList);
api.get('/tracing/:id', [isAuth], routeEdit);
api.put('/tracing/:id', [isAuth], routeUpdate);
api.delete('/tracing/:id', [isAuth, isParent], routeDelete);

module.exports = api;
