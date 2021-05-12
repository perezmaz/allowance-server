/* eslint-disable no-underscore-dangle */
const Category = require('../models/category');
const {
  defaultError,
  defaultResult,
  CustomError,
} = require('../utilities');

const create = async (data, idParent) => {
  try {
    const categoryData = {
      ...data,
      parent: {
        _id: idParent,
      },
    };

    const category = new Category(categoryData);

    await category.save()
      .then(saved => saved)
      .catch(error => {
        let code = -1;
        let status = 500;
        if (error.keyValue.category) {
          code = -2;
          status = 200;
        }
        throw new CustomError(status, code, error.message);
      });

    return defaultResult(200);
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
      'parent._id': idParent,
    };

    const result = await Category.findOne(search)
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
      'parent._id': idParent,
    };
    const result = await Category.find(search).sort({ category: 1 })
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
      'parent._id': idParent,
    };
    const result = await Category.findOneAndUpdate(search, data, { new: true })
      .then(saved => saved)
      .catch(error => {
        let code = -1;
        let status = 500;
        if (error.keyValue.category) {
          code = -2;
          status = 200;
        }
        throw new CustomError(status, code, error.message);
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

const remove = async (id, idParent) => {
  try {
    const search = {
      _id: id,
      'parent._id': idParent,
    };

    const result = await Category.findOneAndDelete(search)
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

module.exports = {
  create,
  edit,
  list,
  update,
  remove,
};
