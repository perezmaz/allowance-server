const joi = require('joi');

const activityValidations = (validationCase, data) => {
  let schema;
  switch (validationCase) {
    case 'create':
    case 'update':
      schema = joi.object().keys({
        activity: joi.string().min(1).max(30).required(),
        category: joi.string().required(),
        child: joi.string().required(),
        percent: joi.number().required().min(0).max(100),
        active: joi.boolean().required(),
        description: joi.string().min(0).max(300).allow(null, ''),
      });
      break;
    case 'findPercentLeft':
      schema = joi.object().keys({
        child: joi.string().required(),
      });
      break;
    default:
  }

  return schema.validate(data);
};

module.exports = activityValidations;
