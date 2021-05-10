const joi = require('joi');

const categoryValidations = (validationCase, data) => {
  let schema;
  switch (validationCase) {
    case 'create':
    case 'update':
      schema = joi.object().keys({
        category: joi.string().min(1).max(30).required(),
        active: joi.boolean().required(),
        idParent: joi.string(),
      });
      break;
    default:
  }

  return schema.validate(data);
};

module.exports = categoryValidations;
