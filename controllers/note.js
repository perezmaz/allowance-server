/* eslint-disable no-underscore-dangle */
const moment = require('moment');
const Note = require('../models/note');
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

    const noteData = {
      ...data,
      child: {
        _id: child,
      },
      parent: {
        _id: idParent,
      },
    };

    const note = new Note(noteData);

    await note.save()
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

    const result = await Note.findOne(search)
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
    const { child, date } = data;
    const search = {
      'parent._id': idParent,
    };

    if (child) {
      search['child._id'] = child;
    }

    if (date) {
      const from = moment(date).startOf('month').format('YYYY-MM-DD');
      const to = moment(date).endOf('month').format('YYYY-MM-DD');

      search.date = {
        $gte: from,
        $lt: to,
      };
    }

    const result = await Note.find(search).sort({ date: 1 })
      .then(finded => finded)
      .catch(error => {
        throw new CustomError(500, -1, error.message);
      });

    const resultWithRelation = await Promise.all(result.map(async record => {
      const findedChild = await findChild(record.child._id);
      return (
        {
          _id: record._id,
          date: record.date,
          note: record.note,
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

    const noteData = {
      ...data,
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
    const result = await Note.findOneAndUpdate(search, noteData, { new: true })
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

    const result = await Note.findOneAndDelete(search)
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
