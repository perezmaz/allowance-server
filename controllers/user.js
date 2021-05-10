/* eslint-disable no-underscore-dangle */
const { hash, compare } = require('bcrypt-promise');
const moment = require('moment');
const mjml2html = require('mjml');
const { createAccessToken, createRefreshToken, createActivateToken, decodeToken } = require('../services/jwt');
const User = require('../models/user');
const { sendMail } = require('../services/notification');
const {
  defaultError,
  defaultResult,
  CustomError,
} = require('../utilities');
const forgotTemplate = require('../templates/forgot.js');
const activateTemplate = require('../templates/activate.js');
const { emails } = require('../config');

const register = async (data, role) => {
  try {
    const user = new User();
    const { username, email, password } = data;

    user.username = username;
    user.email = email;
    user.role = role;
    user.active = false;
    user.password = await hash(password, 0)
      .then(hashResult => hashResult)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    const result = await user.save()
      .then(saved => saved)
      .catch(error => {
        let code = -1;
        let status = 500;
        if (error.keyValue.username) {
          code = -2;
          status = 200;
        }
        if (error.keyValue.email) {
          code = -3;
          status = 200;
        }
        throw new CustomError(status, code, error.message);
      });

    const token = createActivateToken(result);

    const message = activateTemplate.replace('{{name}}', username).replace('{{url}}', `${emails.activate.link}/${token}`);
    const { html } = mjml2html(message);

    const request = {
      subject: emails.activate.subject,
      emailTo: email,
      message: html,
    };

    await sendMail(request);

    return defaultResult(200, result);
  } catch (error) {
    return defaultError(
      error.status ? error.status : 500,
      error.code ? error.code : -1,
      error.message,
    );
  }
};

const login = async data => {
  try {
    const { username, password } = data;
    const user = await User.findOne({ username })
      .then(record => record)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    if (!user) {
      throw new CustomError(200, -2, 'User not found');
    }

    if (!user.active) {
      throw new CustomError(200, -3, 'User inactive');
    }

    const same = await compare(password, user.password)
      .then(compareResult => compareResult)
      .catch(error => {
        throw new CustomError(-1, error.message);
      });

    if (!same) {
      throw new CustomError(200, -4, 'User or password not valid');
    }

    const result = {
      accessToken: createAccessToken(user),
      refreshToken: createRefreshToken(user),
    };

    return defaultResult(201, result);
  } catch (error) {
    return defaultError(
      error.status ? error.status : 500,
      error.code ? error.code : -1,
      error.message,
    );
  }
};

const edit = async id => {
  try {
    const result = await User.findById(id)
      .then(results => results)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    if (!result) {
      throw new CustomError(404, -2, 'Record not found');
    }

    return defaultResult(200, result);
  } catch (error) {
    return defaultError(
      error.status ? error.status : 500,
      error.code ? error.code : -1,
      error.message,
    );
  }
};

const update = async (id, data) => {
  try {
    const findedUser = await User.findById(id)
      .then(saved => saved)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    if (!findedUser) {
      throw new CustomError(404, -2, 'Record not found');
    }

    const same = await compare(data.currentPassword, findedUser.password)
      .then(compareResult => compareResult)
      .catch(error => {
        throw new CustomError(-1, error.message);
      });

    if (!same) {
      throw new CustomError(200, -3, 'Invalid current password');
    }

    const userData = {
      email: data.email,
      username: data.username,
    };

    userData.password = await hash(data.newPassword, 0)
      .then(hashResult => hashResult)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    switch (findedUser.role) {
      case 'parent':
        userData.parent = {
          name: data.name,
        };
        break;
      case 'child':
        userData.child = {
          name: data.name,
          age: data.age,
        };
        break;
      default:
    }

    const result = await User.findByIdAndUpdate(id, userData, { new: true })
      .then(saved => saved)
      .catch(error => {
        let code = -1;
        let status = 500;
        if (error.keyValue.username) {
          code = -4;
          status = 200;
        }
        if (error.keyValue.email) {
          code = -5;
          status = 200;
        }
        throw new CustomError(status, code, error.message);
      });

    return defaultResult(200, result);
  } catch (error) {
    return defaultError(
      error.status ? error.status : 500,
      error.code ? error.code : -1,
      error.message,
    );
  }
};

const forgot = async data => {
  try {
    const { email } = data;

    let newPassword = await hash(moment().unix().toString(), 0)
      .then(hashResult => hashResult)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    newPassword = newPassword.substring(0, 8);

    const password = await hash(newPassword, 0)
      .then(hashResult => hashResult)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    const findedUser = await User.findOneAndUpdate({ email }, { password })
      .then(results => results)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    if (!findedUser) {
      throw new CustomError(404, -2, 'Record not found');
    }

    const name = findedUser.role === 'parent'
      ? findedUser.parent.name || findedUser.username
      : findedUser.child.name || findedUser.username;

    const message = forgotTemplate.replace('{{name}}', name).replace('{{password}}', newPassword);
    const { html } = mjml2html(message);

    const request = {
      subject: emails.forgot.subject,
      emailTo: email,
      message: html,
    };

    const result = await sendMail(request);

    return defaultResult(200, result);
  } catch (error) {
    return defaultError(
      error.status ? error.status : 500,
      error.code ? error.code : -1,
      error.message,
    );
  }
};

const activate = async data => {
  try {
    const { token } = data;
    const user = decodeToken(token);
    const { email } = user;

    const result = await User.findOneAndUpdate({ email }, { active: true }, { new: true })
      .then(saved => saved)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    if (!result) {
      throw new CustomError(404, -2, 'Record not found');
    }

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
  register,
  login,
  edit,
  update,
  forgot,
  activate,
};
