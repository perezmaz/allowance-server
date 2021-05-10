const { decodeToken } = require('../services/jwt');

const isParent = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace(/['"]+/g, '');
    const payload = decodeToken(token);

    if (payload.role !== 'parent') {
      return res.status(403).send({
        code: -1,
        message: 'Parent role required',
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

module.exports = isParent;
