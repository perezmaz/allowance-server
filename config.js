require('dotenv').config();

const { env } = process;

const config = {
  api: {
    HOST: env.HOST,
    VERSION: env.VERSION,
    PORT: env.PORT,
  },
  db: {
    HOST: env.DB_HOST,
    PORT: env.DB_PORT,
    DATABASE: env.DATABASE,
  },
  jwtToken: {
    SECRET_KEY: env.SECRET_KEY,
  },
  notificationService: {
    HOST: env.NOTIFICATION_HOST,
    VERSION: env.NOTIFICATION_VERSION,
    PORT: env.NOTIFICATION_PORT,
  },
  emails: {
    forgot: {
      subject: env.FORGOT_SUBJECT,
    },
    activate: {
      subject: env.ACTIVATE_SUBJECT,
      link: env.ACTIVATE_LINK,
    },
  },
};

module.exports = config;
