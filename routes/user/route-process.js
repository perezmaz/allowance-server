const { register, login, edit, update, forgot, activate } = require('../../controllers/user');
const { userValidations } = require('../../validations');
const { sendValidationError } = require('../../utilities');

const routeRegister = async (req, res) => {
  const data = req.body;
  const { error } = userValidations('register', data);
  if (error) {
    sendValidationError(error, res);
  } else {
    const response = await register(data, 'parent');
    res.status(response.status).send(response);
  }
};

const routeLogin = async (req, res) => {
  const data = req.body;
  const { error } = userValidations('login', data);
  if (error) {
    sendValidationError(error, res);
  } else {
    const response = await login(data);
    res.status(response.status).send(response);
  }
};

const routeEdit = async (req, res) => {
  const { id } = req.params;

  const response = await edit(id);
  res.status(response.status).send(response);
};

const routeUpdate = async (req, res) => {
  const data = req.body;
  const { id } = req.params;

  const { error } = userValidations('update', data);
  if (error) {
    sendValidationError(error, res);
  } else {
    const response = await update(id, data);
    res.status(response.status).send(response);
  }
};

const routeForgot = async (req, res) => {
  const data = req.body;
  const { error } = userValidations('forgot', data);
  if (error) {
    sendValidationError(error, res);
  } else {
    const response = await forgot(data);
    res.status(response.status).send(response);
  }
};

const routeActivate = async (req, res) => {
  const data = req.body;
  const { error } = userValidations('activate', data);
  if (error) {
    sendValidationError(error, res);
  } else {
    const response = await activate(data);
    res.status(response.status).send(response);
  }
};

module.exports = {
  routeRegister,
  routeLogin,
  routeEdit,
  routeUpdate,
  routeForgot,
  routeActivate,
};
