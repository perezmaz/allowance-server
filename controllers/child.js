const { hash } = require('bcrypt-promise');
const moment = require('moment');
const mjml2html = require('mjml');
const { createActivateToken } = require('../services/jwt');
const User = require('../models/user');
const { sendMail } = require('../services/notification');
const newChildTemplate = require('../templates/child.js');
const { emails } = require('../config');

const {
  defaultError,
  defaultResult,
  CustomError,
} = require('../utilities');

const createPassword = async () => {
  try {
    let password = await hash(moment().unix().toString(), 0)
      .then(hashResult => hashResult)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    password = password.substring(0, 8);

    const passwordHash = await hash(password, 0)
      .then(hashResult => hashResult)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    return {
      passwordHash,
      password,
    };
  } catch (error) {
    throw new CustomError(error.status, error.code, error.message);
  }
};

const sendActivationEmail = async (user, password) => {
  const activateToken = createActivateToken(user);

  const message = newChildTemplate
    .replace('{{password}}', password)
    .replace('{{name}}', user.child.name)
    .replace('{{url}}', `${emails.activate.link}/${activateToken}`);
  const { html } = mjml2html(message);

  const request = {
    subject: emails.activate.subject,
    emailTo: user.email,
    message: html,
  };

  await sendMail(request);

  return activateToken;
};

const create = async (data, idParent) => {
  try {
    const { password, passwordHash } = await createPassword();

    const childData = {
      email: data.email,
      role: 'child',
      active: false,
      password: passwordHash,
      child: {
        name: data.name,
        age: data.age,
        parent: {
          _id: idParent,
        },
      },
    };

    const child = new User(childData);

    await child.save()
      .then(saved => saved)
      .catch(error => {
        let code = -1;
        let status = 500;
        if (error.keyValue.email) {
          code = -3;
          status = 200;
        }
        throw new CustomError(status, code, error.message);
      });

    const activateToken = await sendActivationEmail(childData, password);

    return defaultResult(200, { activateToken });
  } catch (error) {
    return defaultError(
      error.status ? error.status : 500,
      error.code ? error.code : -1,
      error.message,
    );
  }
};

const edit = async (id, idParent) => {
  try {
    const search = {
      _id: id,
      'child.parent._id': idParent,
    };

    const result = await User.findOne(search)
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

const list = async (data, idParent) => {
  try {
    const search = {
      ...data,
      'child.parent._id': idParent,
    };

    const result = await User.find(search).sort({ name: 1 })
      .then(finded => finded)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
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

const update = async (id, data, idParent) => {
  try {
    const search = {
      _id: id,
      'child.parent._id': idParent,
    };

    const childData = {
      email: data.email,
      active: true,
      child: {
        name: data.name,
        age: data.age,
        parent: {
          _id: idParent,
        },
      },
    };

    const result = await User.findOneAndUpdate(search, childData, { new: true })
      .then(saved => saved)
      .catch(error => {
        let code = -1;
        let status = 500;
        if (error.keyValue.email) {
          code = -3;
          status = 200;
        }
        throw new CustomError(status, code, error.message);
      });

    if (!result) {
      throw new CustomError(404, -2, 'Record not found');
    }

    return defaultResult(200, { childData });
  } catch (error) {
    return defaultError(
      error.status ? error.status : 500,
      error.code ? error.code : -1,
      error.message,
    );
  }
};

const remove = async (id, idParent) => {
  try {
    const search = {
      _id: id,
      'child.parent._id': idParent,
    };

    const result = await User.findOneAndDelete(search)
      .then(removed => removed)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    if (!result) {
      throw new CustomError(404, -2, 'Record not found');
    }

    return defaultResult(200);
  } catch (error) {
    return defaultError(
      error.status ? error.status : 500,
      error.code ? error.code : -1,
      error.message,
    );
  }
};

const resend = async (id, idParent) => {
  try {
    const search = {
      _id: id,
      'child.parent._id': idParent,
      active: false,
    };

    const { password, passwordHash } = await createPassword();

    const childData = {
      password: passwordHash,
    };

    const result = await User.findOneAndUpdate(search, childData, { new: true })
      .then(saved => saved)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    if (!result) {
      throw new CustomError(500, -2, 'Record not found');
    }

    const activateToken = await sendActivationEmail(result, password);

    return defaultResult(200, { activateToken });
  } catch (error) {
    return defaultError(
      error.status ? error.status : 500,
      error.code ? error.code : -1,
      error.message,
    );
  }
};

module.exports = {
  create,
  edit,
  list,
  update,
  remove,
  resend,
};
