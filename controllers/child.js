const { hash } = require('bcrypt-promise');
const User = require('../models/user');

const {
  defaultError,
  defaultResult,
  CustomError,
} = require('../utilities');

const create = async (data, idParent) => {
  try {
    const childData = {
      username: data.username,
      email: data.email,
      role: 'child',
      active: true,
      child: {
        name: data.name,
        age: data.age,
        parent: {
          _id: idParent,
        },
      },
    };

    childData.password = await hash(data.username, 0)
      .then(hashResult => hashResult)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    const child = new User(childData);

    const result = await child.save()
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

    return defaultResult(200, result);
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
      username: data.username,
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
  create,
  edit,
  list,
  update,
  remove,
};
