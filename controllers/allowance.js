/* eslint-disable no-underscore-dangle */
const Allowance = require('../models/allowance');
const {
  defaultError,
  defaultResult,
  CustomError,
} = require('../utilities');

const create = async (data, idParent) => {
  try {
    const allowanceData = {
      ...data,
      parent: {
        _id: idParent,
      },
    };

    const allowance = new Allowance(allowanceData);

    const result = await allowance.save()
      .then(saved => saved)
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

const edit = async (id, idParent) => {
  try {
    const search = {
      _id: id,
      'parent._id': idParent,
    };

    const result = await Allowance.findOne(search)
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
    const result = await Allowance.find(search).sort({ from: 1 })
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
    const result = await Allowance.findOneAndUpdate(search, data, { new: true })
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

const remove = async (id, idParent) => {
  try {
    const search = {
      _id: id,
      'parent._id': idParent,
    };

    const result = await Allowance.findOneAndDelete(search)
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

const findAmount = async (data, idParent) => {
  try {
    const { date } = data;

    const search = {
      'parent._id': idParent,
      from: {
        $lte: date,
      },
      to: {
        $gte: date,
      },
    };

    const result = await Allowance.findOne(search)
      .then(results => results)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    if (!result) {
      throw new CustomError(200, -2, 'Record not found');
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
  findAmount,
};
