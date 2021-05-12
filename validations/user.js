const joi = require('joi');

const userValidations = (validationCase, data) => {
  let schema;
  switch (validationCase) {
    case 'register':
      schema = joi.object().keys({
        email: joi.string().required().email(),
        username: joi.string().required().min(3).max(20),
        password: joi.string().required().min(8).max(20),
        confirmPassword: joi.string().min(8).max(20).valid(joi.ref('password'))
          .required(),
      });
      break;
    case 'login':
      schema = joi.object().keys({
        username: joi.string().required().min(3).max(20),
        password: joi.string().required().min(8).max(20),
      });
      break;
    case 'update':
      schema = joi.object().keys({
        username: joi.string().required().min(3).max(20),
        email: joi.string().required().email(),
        currentPassword: joi.string().min(8).max(20).allow(null, ''),
        newPassword: joi.string().min(8).max(20).allow(null, ''),
        confirmPassword: joi.string().min(8).max(20).allow(null, '')
          .valid(joi.ref('newPassword')),
        name: joi.string().required().min(3).max(20),
        age: joi.number().min(5).max(18),
      });
      break;
    case 'forgot':
      schema = joi.object().keys({
        email: joi.string().required().email(),
      });
      break;
    case 'activate':
      schema = joi.object().keys({
        token: joi.string().required(),
      });
      break;
    default:
  }

  return schema.validate(data);
};

module.exports = userValidations;
