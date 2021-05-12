const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const {
  userRoutes,
  authRoutes,
  categoryRoutes,
  activityRoutes,
  childRoutes,
  allowanceRoutes,
  tracingRoutes,
} = require('./routes');
const { api } = require('./config');

const server = express();
server.use(express.static('public'));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(helmet());
server.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200,
  }),
);
server.disable('x-powered-by');

server.use(`/api/${api.VERSION}`, userRoutes);
server.use(`/api/${api.VERSION}`, authRoutes);
server.use(`/api/${api.VERSION}`, categoryRoutes);
server.use(`/api/${api.VERSION}`, activityRoutes);
server.use(`/api/${api.VERSION}`, childRoutes);
server.use(`/api/${api.VERSION}`, allowanceRoutes);
server.use(`/api/${api.VERSION}`, tracingRoutes);

module.exports = server;
