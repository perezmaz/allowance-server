/* eslint-disable no-underscore-dangle */
const { messageValidations } = require('../../validations');
const { sendValidationError } = require('../../utilities');
const {
  create,
  list,
  remove,
} = require('../../controllers/message');
const { decodeToken } = require('../../services/jwt');

const routeCreate = async (req, res) => {
  const data = req.body;
  const token = req.headers.authorization.replace(/['"]+/g, '');
  const user = decodeToken(token);

  const { error } = messageValidations('create', data);
  if (error) {
    sendValidationError(error, res);
  } else {
    const response = await create(data, user, token);
    res.status(response.status).send(response);
  }
};

const routeList = async (req, res) => {
  const token = req.headers.authorization.replace(/['"]+/g, '');
  const user = decodeToken(token);

  const response = await list(user);
  res.status(response.status).send(response);
};

const routeDelete = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization.replace(/['"]+/g, '');
  const parent = decodeToken(token);

  const response = await remove(id, parent._id);
  res.status(response.status).send(response);
};

module.exports = {
  routeCreate,
  routeList,
  routeDelete,
};
