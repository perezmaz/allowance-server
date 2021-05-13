/* eslint-disable no-underscore-dangle */
const Message = require('../models/message');
const User = require('../models/user');
const {
  defaultError,
  defaultResult,
  CustomError,
} = require('../utilities');
const { sendMessage } = require('../services/notification');

const findUser = user => (
  User.findById(user)
    .then(finded => finded)
);

const create = async (data, user, token) => {
  try {
    const { _id, parentId, name, avatar } = user;

    const messageData = {
      ...data,
      from: {
        _id,
      },
      channel: parentId,
    };

    const message = new Message(messageData);

    const result = await message.save()
      .then(saved => saved)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    const pushMessageData = {
      from: {
        _id,
        name,
        avatar,
      },
      message: result.message,
      channel: parentId,
      createdAt: result.createdAt,
    };
    await sendMessage(token, pushMessageData);

    return defaultResult(200);
  } catch (error) {
    return defaultError(
      error.status ? error.status : 500,
      error.code ? error.code : -1,
      error.message,
    );
  }
};

const list = async user => {
  try {
    const { parentId } = user;

    const result = await Message.find({ channel: parentId }).sort({ date: 1 })
      .then(finded => finded)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    const resultWithRelation = await Promise.all(result.map(async record => {
      const findedUser = await findUser(record.from._id);
      return (
        {
          _id: record._id,
          channel: record.channel,
          message: record.message,
          from: {
            _id: record.from._id,
            name: findedUser.role === 'parent'
              ? findedUser.parent.name || ''
              : findedUser.child.name || '',
            avatar: findedUser.avatar,
          },
          createdAt: record.createdAt,
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

const remove = async (id, from) => {
  try {
    const search = {
      _id: id,
      'from._id': from,
    };

    const result = await Message.findOneAndDelete(search)
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
  list,
  remove,
};
