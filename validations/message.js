const joi = require('joi');

const messageValidations = (validationCase, data) => {
  let schema;
  switch (validationCase) {
    case 'create':
      schema = joi.object().keys({
        message: joi.string().min(1).max(300).required(),
      });
      break;
    default:
  }

  return schema.validate(data);
};

module.exports = messageValidations;
