/* eslint-disable no-underscore-dangle */
const Child = require('../models/user');
const Tracing = require('../models/tracing');
const Activity = require('../models/activity');
const Category = require('../models/category');
const { createNotification } = require('../services/notification');

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

const findActivity = id => (
  Activity.findById(id)
    .then(finded => finded)
);

const create = async (data, idParent, token) => {
  try {
    const {
      date,
      amount,
      child,
      activities,
    } = data;

    const findedChild = await findChild(child);

    if (!findedChild) {
      throw new CustomError(402, -1, 'Child not found');
    }

    const tracingData = {
      date,
      amount,
      child: {
        _id: findedChild._id,
        name: findedChild.child.name,
        age: findedChild.child.age,
        avatar: findedChild.avatar,
      },
      parent: {
        _id: idParent,
      },
      activities: [],
    };

    await Promise.all(activities.map(async activity => {
      const findedActivity = await findActivity(activity._id);
      if (findedActivity) {
        const findedCategory = await findCategory(findedActivity.category._id);
        tracingData.activities.push(
          {
            _id: activity._id,
            activity: findedActivity.activity,
            basePercent: findedActivity.percent,
            baseAmount: activity.amount,
            tracingPercent: activity.tracingPercent,
            realAmount: activity.realAmount,
            category: {
              category: findedCategory ? findedCategory.category : '',
            },
          },
        );
      }
    }));

    tracingData.realAmount = activities.reduce((accumulator, activity) => (
      accumulator + activity.realAmount
    ), 0);

    const tracing = new Tracing(tracingData);

    const result = await tracing.save()
      .then(saved => saved)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    const notificationData = {
      message: 'notification.new.tracing',
      to: result.child._id,
      linkId: result._id,
    };
    await createNotification(token, notificationData);

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

    const result = await Tracing.findOne(search)
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

    const result = await Tracing.find(search).sort({ activity: 1 })
      .then(results => results)
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

const update = async (id, data, user, token) => {
  try {
    const search = {
      _id: id,
      'parent._id': user.parentId,
    };

    const result = await Tracing.findOneAndUpdate(search, data, { new: true })
      .then(saved => saved)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    if (!result) {
      throw new CustomError(404, -2, 'Record not found');
    }

    const notificationData = {
      message: 'notification.new.comment',
      to: user.role === 'parent' ? result.child._id : user.parentId,
      linkId: result._id,
    };
    await createNotification(token, notificationData);

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

    const result = await Tracing.findOneAndDelete(search)
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
