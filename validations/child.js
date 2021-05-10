const joi = require('joi');

const childValidations = (validationCase, data) => {
  let schema;
  switch (validationCase) {
    case 'create':
    case 'update':
      schema = joi.object().keys({
        email: joi.string().required().email(),
        username: joi.string().required().min(3).max(20),
        name: joi.string().required().min(3).max(20),
        age: joi.number().required().min(5).max(18),
      });
      break;
    default:
  }

  return schema.validate(data);
};

module.exports = childValidations;
