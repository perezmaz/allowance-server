/* eslint-disable no-underscore-dangle */
const Activity = require('../models/activity');
const Category = require('../models/category');
const Child = require('../models/user');

const {
  defaultError,
  defaultResult,
  CustomError,
} = require('../utilities');

const findCategory = category => (
  Category.findById(category)
    .then(finded => finded)
);

const findChild = child => (
  Child.findById(child)
    .then(finded => finded)
);

const create = async (data, idParent) => {
  try {
    const {
      activity,
      category,
      child,
      percent,
      active,
      description,
    } = data;

    const findedCategory = await findCategory(category);

    if (!findedCategory) {
      throw new CustomError(402, -1, 'Category not found');
    }

    const findedChild = await findChild(child);

    if (!findedChild) {
      throw new CustomError(402, -1, 'Child not found');
    }

    const activityData = {
      activity,
      percent,
      active,
      description,
      category: {
        _id: category,
      },
      child: {
        _id: child,
      },
      parent: {
        _id: idParent,
      },
    };

    const newActivity = new Activity(activityData);

    const result = await newActivity.save()
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

    const result = await Activity.findOne(search)
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

    const result = await Activity.find(search).sort({ activity: 1 })
      .then(results => results)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    const resultWithRelation = await Promise.all(result.map(async record => {
      const findedCategory = await findCategory(record.category._id);
      const findedChild = await findChild(record.child._id);
      return (
        {
          _id: record._id,
          activity: record.activity,
          percent: record.percent,
          active: record.active,
          description: record.description,
          category: {
            _id: record.category._id,
            category: findedCategory ? findedCategory.category : '',
          },
          child: {
            _id: record.child._id,
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
    const {
      activity,
      category,
      child,
      percent,
      active,
      description,
    } = data;

    const findedCategory = await findCategory(category);

    if (!findedCategory) {
      throw new CustomError(402, -1, 'Category not found');
    }

    const findedChild = await findChild(child);

    if (!findedChild) {
      throw new CustomError(402, -1, 'Child not found');
    }

    const activityData = {
      activity,
      percent,
      active,
      description,
      category: {
        _id: category,
      },
      child: {
        _id: child,
      },
      parent: {
        _id: idParent,
      },
    };

    const search = {
      _id: id,
      'parent._id': idParent,
    };

    const result = await Activity.findOneAndUpdate(search, activityData, { new: true })
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

    const result = await Activity.findOneAndDelete(search)
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

const findPercentLeft = async (data, idParent) => {
  try {
    const search = {
      'parent._id': idParent,
      'child._id': data.child,
      active: true,
    };

    const result = await Activity.find(search)
      .then(results => results)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    if (!result) {
      throw new CustomError(200, -2, 'Record not found');
    }

    const percentTotal = result.reduce((accumulator, item) => accumulator + item.percent, 0);
    const percentLeft = 100 - percentTotal;

    return defaultResult(200, {
      percentTotal,
      percentLeft,
    });
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
  findPercentLeft,
};
