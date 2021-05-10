/* eslint-disable no-underscore-dangle */
const { activityValidations } = require('../../validations');
const { sendValidationError } = require('../../utilities');
const {
  create,
  edit,
  list,
  update,
  remove,
  findPercentLeft,
} = require('../../controllers/activity');
const { decodeToken } = require('../../services/jwt');

const routeCreate = async (req, res) => {
  const data = req.body;
  const token = req.headers.authorization.replace(/['"]+/g, '');
  const parent = decodeToken(token);

  const { error } = activityValidations('create', data);
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
  let data = req.query;
  const token = req.headers.authorization.replace(/['"]+/g, '');
  const user = decodeToken(token);
  if (user.role === 'child') {
    data = {
      ...data,
      'child._id': user._id,
    };
  }

  const response = await list(data, user.parentId);
  res.status(response.status).send(response);
};

const routeUpdate = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const token = req.headers.authorization.replace(/['"]+/g, '');
  const parent = decodeToken(token);

  const { error } = activityValidations('update', data);
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

const routeFindPercentLeft = async (req, res) => {
  const data = req.query;
  const token = req.headers.authorization.replace(/['"]+/g, '');
  const parent = decodeToken(token);

  const { error } = activityValidations('findPercentLeft', data);
  if (error) {
    sendValidationError(error, res);
  } else {
    const response = await findPercentLeft(data, parent._id);
    res.status(response.status).send(response);
  }
};

module.exports = {
  routeCreate,
  routeEdit,
  routeList,
  routeUpdate,
  routeDelete,
  routeFindPercentLeft,
};
