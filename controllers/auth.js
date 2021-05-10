/* eslint-disable no-unused-vars */
const moment = require('moment');
const { decodeToken, createAccessToken } = require('../services/jwt');
const User = require('../models/user');
const {
  defaultError,
  defaultResult,
  CustomError,
} = require('../utilities');

const checkExpiredToken = expiredAt => {
  const today = moment().unix();

  if (today > expiredAt) {
    return true;
  }

  return false;
};

const refreshAccessToken = async data => {
  try {
    const { refreshToken } = data;
    const { _id, expiredAt } = decodeToken(refreshToken);

    if (checkExpiredToken(expiredAt)) {
      throw new CustomError(200, -2, 'Refresh token expired');
    }

    const user = await User.findById(_id)
      .then(finded => finded)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    if (!user) {
      throw new CustomError(200, -3, 'User not found');
    }

    if (!user.active) {
      throw new CustomError(200, -4, 'User inactive');
    }

    const accessToken = createAccessToken(user);

    const result = {
      accessToken,
      refreshToken,
    };

    return defaultResult(200, result);
  } catch (error) {
    return defaultError(
      error.status ? error.status : 500,
      error.code ? error.code : -1,
      error.message,
    );
  }
};

module.exports = {
  refreshAccessToken,
};
