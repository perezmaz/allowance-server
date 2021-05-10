class CustomError extends Error {
  constructor(status, code, customMessage, ...params) {
    super(...params);
    this.name = 'ServerError';
    this.status = status;
    this.code = code;
    this.message = customMessage;
  }
}

const defaultError = (status, code, message) => {
  const error = {
    status,
    code,
    message,
  };
  return error;
};

const defaultResult = (status, result) => {
  const error = {
    status,
    code: 0,
    result,
  };
  return error;
};

const sendValidationError = (error, res) => {
  res.status(422).send({
    code: -99,
    error: error.details[0].message,
  });
};

module.exports = {
  defaultError,
  defaultResult,
  CustomError,
  sendValidationError,
};
