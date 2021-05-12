const joi = require('joi');

const allowanceValidations = (validationCase, data) => {
  let schema;
  switch (validationCase) {
    case 'create':
    case 'update':
      schema = joi.object().keys({
        amount: joi.number().min(1).max(1000000).required(),
        from: joi.date().required(),
        to: joi.date().required().min(joi.ref('from')),
        child: joi.string().required(),
      });
      break;
    case 'findAmount':
      schema = joi.object().keys({
        date: joi.date().required(),
        child: joi.string().required(),
      });
      break;
    default:
  }

  return schema.validate(data);
};

module.exports = allowanceValidations;
