const moment = require('moment');
const { decodeToken } = require('../services/jwt');

const isAuth = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(403).send({
        code: -1,
        message: 'Forbidden action',
      });
    }

    const token = req.headers.authorization.replace(/['"]+/g, '');
    const payload = decodeToken(token);

    if (payload.expired_at <= moment.unix()) {
      return res.status(404).send({
        code: -1,
        message: 'Token expired',
      });
    }
  } catch (error) {
    return res.status(404).send({
      code: -1,
      message: 'Invalid token',
    });
  }

  return next();
};

module.exports = isAuth;
