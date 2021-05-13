const joi = require('joi');

const noteValidations = (validationCase, data) => {
  let schema;
  switch (validationCase) {
    case 'create':
    case 'update':
      schema = joi.object().keys({
        date: joi.date().required(),
        child: joi.string().required(),
        note: joi.string().min(1).max(1000).required(),
      });
      break;
    default:
  }

  return schema.validate(data);
};

module.exports = noteValidations;
