/* eslint-disable no-underscore-dangle */
const { noteValidations } = require('../../validations');
const { sendValidationError } = require('../../utilities');
const {
  create,
  edit,
  list,
  update,
  remove,
} = require('../../controllers/note');
const { decodeToken } = require('../../services/jwt');

const routeCreate = async (req, res) => {
  const data = req.body;
  const token = req.headers.authorization.replace(/['"]+/g, '');
  const parent = decodeToken(token);

  const { error } = noteValidations('create', data);
  if (error) {
    sendValidationError(error, res);
  } else {
    const response = await create(data, parent._id);
    res.status(response.status).send(response);
  }
};

const routeEdit = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization.replace(/['"]+/g, '');
  const parent = decodeToken(token);

  const response = await edit(id, parent._id);
  res.status(response.status).send(response);
};

const routeList = async (req, res) => {
  const data = req.query;
  const token = req.headers.authorization.replace(/['"]+/g, '');
  const parent = decodeToken(token);

  const response = await list(data, parent._id);
  res.status(response.status).send(response);
};

const routeUpdate = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const token = req.headers.authorization.replace(/['"]+/g, '');
  const parent = decodeToken(token);

  const { error } = noteValidations('update', data);
  if (error) {
    sendValidationError(error, res);
  } else {
    const response = await update(id, data, parent._id);
    res.status(response.status).send(response);
  }
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
  routeEdit,
  routeList,
  routeUpdate,
  routeDelete,
};
