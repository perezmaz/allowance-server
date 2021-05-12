const express = require('express');
const multipart = require('connect-multiparty');
const {
  routeRegister,
  routeLogin,
  routeEdit,
  routeUpdate,
  routeForgot,
  routeActivate,
  routeUploadAvatar,
  routeGetAvatar,
} = require('./route-process');
const isAuth = require('../../middleware/auth');

const isUpload = multipart({
  uploadDir: './public/avatar',
  maxFilesSize: 1024 * 1024,
});

const api = express.Router();

api.post('/register', routeRegister);
api.post('/login', routeLogin);
api.post('/forgot', routeForgot);
api.post('/activate', routeActivate);
api.get('/user/:id', [isAuth], routeEdit);
api.put('/user/:id', [isAuth], routeUpdate);
api.get('/avatar/:fileName', routeGetAvatar);
api.put('/avatar/:id', [isAuth, isUpload], routeUploadAvatar);

module.exports = api;
