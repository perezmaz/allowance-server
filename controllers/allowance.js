/* eslint-disable no-underscore-dangle */
const Allowance = require('../models/allowance');
const Child = require('../models/user');

const {
  defaultError,
  defaultResult,
  CustomError,
} = require('../utilities');

const findChild = child => (
  Child.findById(child)
    .then(finded => finded)
);

const create = async (data, idParent) => {
  try {
    const { child } = data;
    const findedChild = await findChild(child);

    if (!findedChild) {
      throw new CustomError(402, -1, 'Child not found');
    }

    const allowanceData = {
      ...data,
      child: {
        _id: child,
      },
      parent: {
        _id: idParent,
      },
    };

    const allowance = new Allowance(allowanceData);

    await allowance.save()
      .then(saved => saved)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
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

    const resultWithRelation = await Promise.all(result.map(async record => {
      const findedChild = await findChild(record.child._id);
      return (
        {
          _id: record._id,
          amount: record.amount,
          from: record.from,
          to: record.to,
          child: {
            name: findedChild ? findedChild.child.name : '',
          },
        }
      );
    }));

    return defaultResult(200, resultWithRelation);
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
    const { child } = data;
    const findedChild = await findChild(child);

    if (!findedChild) {
      throw new CustomError(402, -1, 'Child not found');
    }

    const search = {
      _id: id,
      'parent._id': idParent,
    };

    const allowanceData = {
      ...data,
      child: {
        _id: child,
      },
    };

    const result = await Allowance.findOneAndUpdate(search, allowanceData, { new: true })
      .then(saved => saved)
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

    return defaultResult(200);
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
    const { date, child } = data;

    const search = {
      'parent._id': idParent,
      from: {
        $lte: date,
      },
      to: {
        $gte: date,
      },
      'child._id': child,
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
