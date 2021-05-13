const userValidations = require('./user');
const authValidations = require('./auth');
const categoryValidations = require('./category');
const activityValidations = require('./activity');
const childValidations = require('./child');
const allowanceValidations = require('./allowance');
const tracingValidations = require('./tracing');
const noteValidations = require('./note');
const messageValidations = require('./message');

module.exports = {
  userValidations,
  authValidations,
  categoryValidations,
  activityValidations,
  childValidations,
  allowanceValidations,
  tracingValidations,
  noteValidations,
  messageValidations,
};
