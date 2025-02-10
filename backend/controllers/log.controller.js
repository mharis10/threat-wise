const httpStatus = require('http-status-codes').StatusCodes;
const { Log } = require('../models/log.model');
const { User } = require('../models/user.model');
const { Company } = require('../models/company.model');
const fs = require('fs');
const path = require('path');
const logger = require('../startup/logging');

const LOG_DIR = './logs';

const logController = {
  getAllLogs: async (req, res) => {
    const logs = await Log.findAll({
      include: [
        {
          model: User,
          attributes: [
            'id',
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
            'companyId',
            'role',
            'isActive',
          ],
          include: [
            {
              model: Company,
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    return res.status(httpStatus.OK).json(logs);
  },

  getErrorLogs: async (req, res) => {
    const files = fs
      .readdirSync(LOG_DIR)
      .filter((file) => file.endsWith('.log'))
      .map((file) => {
        const filePath = path.join(LOG_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          createdAt: stats.birthtime,
          updatedAt: stats.mtime,
        };
      });

    res.status(httpStatus.OK).json(files);
  },

  downloadErrorLog: async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(LOG_DIR, filename);

    if (filename.includes('..')) {
      console.warn('Directory traversal attempt detected');
      logger.warn('Directory traversal attempt detected');

      return res.status(httpStatus.BAD_REQUEST).send('Invalid file path');
    }

    if (fs.existsSync(filePath)) {
      res.download(filePath, filename);
    } else {
      console.warn('File not found:', filename);
      logger.warn('File not found:', filename);

      res.status(httpStatus.NOT_FOUND).send('File not found');
    }
  },
};

module.exports = logController;
