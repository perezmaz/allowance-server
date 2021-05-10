const { refreshAccessToken } = require('../../controllers/auth');
const { authValidations } = require('../../validations');
const { sendValidationError } = require('../../utilities');

const routeRefreshAccessToken = async (req, res) => {
  const data = req.body;
  const { error } = authValidations('refreshAccessToken', data);
  if (error) {
    sendValidationError(error, res);
  } else {
    const response = await refreshAccessToken(data);
    res.status(response.status).send(response);
  }
};

module.exports = {
  routeRefreshAccessToken,
};
