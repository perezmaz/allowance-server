const joi = require('joi');

const activityValidations = (validationCase, data) => {
  let schema;
  switch (validationCase) {
    case 'create':
      schema = joi.object().keys({
        amount: joi.number().min(1).max(1000000).required(),
        date: joi.date().required(),
        child: joi.string().required(),
        activities: joi.array().items(
          {
            _id: joi.required(),
            tracingPercent: joi.number().required().min(0).max(100),
            amount: joi.number().min(1).max(1000000).required(),
            realAmount: joi.number().min(1).max(1000000).required(),
          },
        ),
      });
      break;
    case 'update':
      schema = joi.object().keys({
        comments: joi.string(),
        feedback: joi.string(),
      });
      break;
    default:
  }

  return schema.validate(data);
};

module.exports = activityValidations;
