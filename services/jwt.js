/* eslint-disable no-underscore-dangle */
const jwt = require('jwt-simple');
const moment = require('moment');
const { jwtToken } = require('../config');

const createAccessToken = user => {
  const payload = {
    _id: user.id,
    email: user.email,
    role: user.role,
    name: user.role === 'parent'
      ? user.parent.name || 'No Name'
      : user.child.name || 'No Name',
    parentId: user.role === 'child'
      ? user.child.parent._id
      : user.id,
    avatar: user.avatar,
    age: user.role === 'parent'
      ? 'N/A'
      : user.child.age || 'N/A',
    tutorial: user.tutorial,
    createdAt: moment().unix(),
    expiredAt: moment().add(30, 'minutes').unix(),
  };

  return jwt.encode(payload, jwtToken.SECRET_KEY);
};

const createRefreshToken = user => {
  const payload = {
    _id: user.id,
    expiredAt: moment().add(1, 'day').unix(),
  };

  return jwt.encode(payload, jwtToken.SECRET_KEY);
};

const createActivateToken = user => {
  const payload = {
    email: user.email,
    createdAt: moment().unix(),
  };

  return jwt.encode(payload, jwtToken.SECRET_KEY);
};

const decodeToken = token => jwt.decode(token, jwtToken.SECRET_KEY, true);

module.exports = {
  createAccessToken,
  createRefreshToken,
  decodeToken,
  createActivateToken,
};
