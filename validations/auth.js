const joi = require('joi');

const authValidations = (validationCase, data) => {
  let schema;
  switch (validationCase) {
    case 'refreshAccessToken':
      schema = joi.object().keys({
        refreshToken: joi.string().required(),
      });
      break;
    default:
  }

  return schema.validate(data);
};

module.exports = authValidations;
