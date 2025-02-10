const httpStatus = require('http-status-codes').StatusCodes;
const {
  EmailTemplate,
  validateEmailTemplate,
} = require('../models/emailTemplate.model');
const { Log } = require('../models/log.model');
const { User } = require('../models/user.model');
const logger = require('../startup/logging');
const { Op } = require('sequelize');
const fs = require('fs');

const emailTemplateController = {
  getValidTags: async (req, res) => {
    const validTags = process.env.VALID_TAGS.split(',');

    return res.status(httpStatus.OK).json(validTags);
  },

  createTemplate: async (req, res) => {
    const { title, subject, body, tags } = req.body;

    const { error } = validateEmailTemplate(req.body);

    if (error) {
      console.warn(`Invalid data format: ${error}`);
      logger.warn(`Invalid data format: ${error}`);

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: `Invalid data format: ${error}` });
    }

    const tagsString = tags ? tags.join(',') : null;

    let template = fs.readFileSync(
      './emailTemplates/defaultPhishingTemplate.html',
      'utf-8'
    );

    const defaultTemplate = template.replace('{{Body}}', body);

    const newEmailTemplate = await EmailTemplate.create({
      userId: req.user.id,
      title,
      subject,
      body: defaultTemplate,
      tags: tagsString,
    });

    Log.create({
      userId: req.user.id,
      action: process.env.CREATE_EMAIL_TEMPLATE_ACTION,
      message: `Email Template registered with ID ${newEmailTemplate.id}`,
    });

    res.status(httpStatus.CREATED).json({
      message: 'Email Template registered successfully!',
      template: newEmailTemplate,
    });
  },

  getMyTemplates: async (req, res) => {
    const emailTemplates = await EmailTemplate.findAll({
      include: [
        {
          model: User,
          attributes: [
            'id',
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
            'mobileNumber',
            'companyId',
            'jobTitle',
            'linkedin',
            'location',
            'department',
            'language',
            'lineManagerId',
            'role',
            'isActive',
          ],
          where: {
            [Op.or]: [{ id: req.user.id }, { role: process.env.SUPER_ADMIN }],
          },
        },
      ],
    });

    if (!emailTemplates || !emailTemplates.length) {
      console.warn('Email Templates not found');
      logger.warn('Email Templates not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Email Templates not found' });
    }

    const transformedEmailTemplates = emailTemplates.map((template) => ({
      ...template.get({ plain: true }),
      tags: template.tags ? template.tags.split(',') : [],
    }));

    res.status(httpStatus.OK).json(transformedEmailTemplates);
  },

  getAllTemplates: async (req, res) => {
    let queryFilters = {};

    const validColumns = ['id', 'userId', 'title', 'subject', 'isActive'];
    validColumns.forEach((column) => {
      if (req.query[column]) {
        queryFilters[column] = req.query[column];
      }
    });

    const emailTemplates = await EmailTemplate.findAll({
      where: queryFilters,
      include: [
        {
          model: User,
          attributes: [
            'id',
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
            'mobileNumber',
            'companyId',
            'jobTitle',
            'linkedin',
            'location',
            'department',
            'language',
            'lineManagerId',
            'role',
            'isActive',
          ],
        },
      ],
    });

    if (!emailTemplates || !emailTemplates.length) {
      console.warn('Email Templates not found');
      logger.warn('Email Templates not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Email Templates not found' });
    }

    const transformedEmailTemplates = emailTemplates.map((template) => ({
      ...template.get({ plain: true }),
      tags: template.tags ? template.tags.split(',') : [],
    }));

    res.status(httpStatus.OK).json(transformedEmailTemplates);
  },

  updateMyTemplate: async (req, res) => {
    const { title, subject, body, tags } = req.body;

    const emailTemplate = await EmailTemplate.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!emailTemplate) {
      console.warn('Email Template not found');
      logger.warn('Email Template not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Email Template not found' });
    }

    const { error } = validateEmailTemplate({
      title: title ? title : emailTemplate.title,
      subject: subject ? subject : emailTemplate.subject,
      body: body ? body : emailTemplate.body,
      tags: tags ? tags : emailTemplate.tags.split(','),
    });

    if (error) {
      console.warn(`Invalid data format: ${error}`);
      logger.warn(`Invalid data format: ${error}`);

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: `Invalid data format: ${error}` });
    }

    if (title) emailTemplate.title = title;
    if (subject) emailTemplate.subject = subject;
    if (body) emailTemplate.body = body;
    if (tags) emailTemplate.tags = tags.join(',');

    await emailTemplate.save();

    emailTemplate.tags = emailTemplate.tags
      ? emailTemplate.tags.split(',')
      : emailTemplate.tags;

    Log.create({
      userId: req.user.id,
      action: process.env.EMAIL_TEMPLATE_UPDATE_ACTION,
      message: `Email Template with ID ${emailTemplate.id} updated its data`,
    });

    res.status(httpStatus.OK).json({
      message: 'Email Template updated successfully',
      updatedEmailTemplate: emailTemplate,
    });
  },

  updateTemplate: async (req, res) => {
    const { title, subject, body, tags } = req.body;

    const emailTemplate = await EmailTemplate.findByPk(req.params.id);

    if (!emailTemplate) {
      console.warn('Email Template not found');
      logger.warn('Email Template not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Email Template not found' });
    }

    const { error } = validateEmailTemplate({
      title: title ? title : emailTemplate.title,
      subject: subject ? subject : emailTemplate.subject,
      body: body ? body : emailTemplate.body,
      tags: tags ? tags : emailTemplate.tags.split(','),
    });

    if (error) {
      console.warn(`Invalid data format: ${error}`);
      logger.warn(`Invalid data format: ${error}`);

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: `Invalid data format: ${error}` });
    }

    if (title) emailTemplate.title = title;
    if (subject) emailTemplate.subject = subject;
    if (body) emailTemplate.body = body;
    if (tags) emailTemplate.tags = tags.join(',');

    await emailTemplate.save();

    emailTemplate.tags = emailTemplate.tags
      ? emailTemplate.tags.split(',')
      : emailTemplate.tags;

    Log.create({
      userId: req.user.id,
      action: process.env.EMAIL_TEMPLATE_UPDATE_ACTION,
      message: `Email Template with ID ${emailTemplate.id} updated`,
    });

    res.status(httpStatus.OK).json({
      message: 'Email Template updated successfully',
      updatedEmailTemplate: emailTemplate,
    });
  },

  disableMyTemplate: async (req, res) => {
    const emailTemplate = await EmailTemplate.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!emailTemplate) {
      console.warn('Email Template not found');
      logger.warn('Email Template not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Email Template not found' });
    }

    emailTemplate.isActive = false;

    await emailTemplate.save();

    Log.create({
      userId: req.user.id,
      action: process.env.EMAIL_TEMPLATE_DISABLED_ACTION,
      message: `Email Template disabled with ID ${emailTemplate.id}`,
    });

    res.status(httpStatus.OK).json({
      message: 'Email Template disabled successfully',
    });
  },

  disableTemplate: async (req, res) => {
    const emailTemplate = await EmailTemplate.findByPk(req.params.id);

    if (!emailTemplate) {
      console.warn('Email Template not found');
      logger.warn('Email Template not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Email Template not found' });
    }

    emailTemplate.isActive = false;

    await emailTemplate.save();

    Log.create({
      userId: req.user.id,
      action: process.env.EMAIL_TEMPLATE_DISABLED_ACTION,
      message: `Email Template disabled with ID ${emailTemplate.id}`,
    });

    res.status(httpStatus.OK).json({
      message: 'Email Template disabled successfully',
    });
  },

  enableMyTemplate: async (req, res) => {
    const emailTemplate = await EmailTemplate.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!emailTemplate) {
      console.warn('Email Template not found');
      logger.warn('Email Template not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Email Template not found' });
    }

    if (emailTemplate.isActive) {
      console.warn('Email Template is already enabled');
      logger.warn('Email Template is already enabled');

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Email Template is already enabled' });
    }

    emailTemplate.isActive = true;

    await emailTemplate.save();

    Log.create({
      userId: req.user.id,
      action: process.env.EMAIL_TEMPLATE_ENABLED_ACTION,
      message: `Email Template enabled with ID ${emailTemplate.id}`,
    });

    res.status(httpStatus.OK).json({
      message: 'Email Template enabled successfully',
    });
  },

  enableTemplate: async (req, res) => {
    const emailTemplate = await EmailTemplate.findByPk(req.params.id);

    if (!emailTemplate) {
      console.warn('Email Template not found');
      logger.warn('Email Template not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Email Template not found' });
    }

    if (emailTemplate.isActive) {
      console.warn('Email Template is already enabled');
      logger.warn('Email Template is already enabled');

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Email Template is already enabled' });
    }

    emailTemplate.isActive = true;

    await emailTemplate.save();

    Log.create({
      userId: req.user.id,
      action: process.env.EMAIL_TEMPLATE_ENABLED_ACTION,
      message: `Email Template enabled with ID ${emailTemplate.id}`,
    });

    res.status(httpStatus.OK).json({
      message: 'Email Template enabled successfully',
    });
  },
};

module.exports = emailTemplateController;
