const express = require('express');
const cors = require('cors');
const traceIdMiddlware = require('../middlewares/traceId');
const loggerMiddleware = require('../middlewares/logger');
const email = require('../routers/email.route');
const authentication = require('../routers/authentication.route');
const user = require('../routers/user.route');
const company = require('../routers/company.route');
const group = require('../routers/group.route');
const groupMember = require('../routers/groupMember.route');
const emailTemplate = require('../routers/emailTemplate.route');
const campaign = require('../routers/campaign.route');
const campaignRecipient = require('../routers/campaignRecipient.route');
const stats = require('../routers/stats.route');
const log = require('../routers/log.route');
const gpt = require('../routers/gpt.route');
const error = require('../middlewares/error');

const corsOptions = {
  origin:
    process.env.CORS_ORIGIN === '*' ? '*' : process.env.CORS_ORIGIN?.split(','),
  methods: 'POST,GET,PATCH,DELETE',
  allowedHeaders: ['Content-Type', 'access-token', 'refresh-token'],
  exposedHeaders: ['access-token', 'refresh-token'],
  optionsSuccessStatus: 200,
};

module.exports = (app) => {
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(traceIdMiddlware);
  app.use(loggerMiddleware);
  app.use('/api/email', email);
  app.use('/api/auth', authentication);
  app.use('/api/user', user);
  app.use('/api/company', company);
  app.use('/api/group', group);
  app.use('/api/groupMember', groupMember);
  app.use('/api/emailTemplate', emailTemplate);
  app.use('/api/campaign', campaign);
  app.use('/api/campaignRecipient', campaignRecipient);
  app.use('/api/stats', stats);
  app.use('/api/log', log);
  app.use('/api/gpt', gpt);
  app.use(error);
};
