const axios = require('axios');
const { notificationService } = require('../config');

const notificationApi = axios.create({
  baseURL: `${notificationService.HOST}:${notificationService.PORT}/api/${notificationService.VERSION}`,
  timeout: 60000,
});

notificationApi.defaults.headers['Content-Type'] = 'application/json';

const createNotification = async (token, data) => {
  notificationApi.defaults.headers.Authorization = token;

  const result = await notificationApi.post('/notification', data)
    .then(response => response.data)
    .catch(error => error.response.data);

  return result;
};

const sendMail = async data => {
  const result = await notificationApi.post('/mailer', data)
    .then(response => response.data)
    .catch(error => error.response.data);

  return result;
};

const sendMessage = async (token, data) => {
  notificationApi.defaults.headers.Authorization = token;

  const result = await notificationApi.post('/sendMessage', data)
    .then(response => response.data)
    .catch(error => error.response.data);

  return result;
};

module.exports = {
  createNotification,
  sendMail,
  sendMessage,
};
