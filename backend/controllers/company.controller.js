const logger = require('../startup/logging');
const httpStatus = require('http-status-codes').StatusCodes;
const { User, generateAccessToken } = require('../models/user.model');
const { Company, validateCompany } = require('../models/company.model');
const { Group } = require('../models/group.model');
const { GroupMember } = require('../models/groupMember.model');
const { Log } = require('../models/log.model');
const xlsx = require('xlsx');
const csv = require('csv-parse');
const fs = require('fs');
const path = require('path');
const { sendCompanyEmployeeSignUpEmail } = require('../helpers/email');
const { sequelize } = require('../startup/db');
const { validateField, validators } = require('../helpers/fieldValidators');

const companyController = {
  registerCompany: async (req, res) => {
    const {
      name,
      industry,
      email,
      address,
      contractStartDate,
      contractLength,
      currentMailBoxes,
      maxMailBoxes,
      chatgptIntegration,
      trainingVideos,
      smsPhishingSimulation,
      widget,
      rewards,
      price,
    } = req.body;

    const { error } = validateCompany(req.body);

    if (error) {
      console.warn(`Invalid data format: ${error}`);
      logger.warn(`Invalid data format: ${error}`);

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: `Invalid data format: ${error}` });
    }

    const [newCompany, created] = await Company.findOrCreate({
      where: { email },
      defaults: {
        name,
        industry,
        email,
        address,
        contractStartDate,
        contractLength,
        currentMailBoxes,
        maxMailBoxes,
        chatgptIntegration,
        trainingVideos,
        smsPhishingSimulation,
        widget,
        rewards,
        price,
      },
    });

    if (!created) {
      console.warn('Company already registered');
      logger.warn('Company already registered');

      return res
        .status(httpStatus.CONFLICT)
        .json({ error: 'Company already registered' });
    }

    Log.create({
      userId: req.user.id,
      action: process.env.REGISTER_COMPANY_ACTION,
      message: `Company registered with ID ${newCompany.id}`,
    });

    res.status(httpStatus.CREATED).json({
      message: 'Company registered successfully!',
      company: newCompany,
    });
  },

  downloadTemplate: async (req, res) => {
    const filePath = path.join(__dirname, '../dataTemplates', 'template.xlsx');

    if (fs.existsSync(filePath)) {
      res.download(filePath, 'template.xslx');
    } else {
      console.warn('Template not found.');
      logger.warn('Template not found.');

      res.status(httpStatus.NOT_FOUND).send('Template not found');
    }
  },

  verifyData: async (req, res) => {
    const file = req.file;

    if (!file) {
      console.warn('No file uploaded');
      logger.warn('No file uploaded');

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'No file uploaded' });
    }

    const fileType = file.mimetype;

    if (
      fileType != 'text/csv' &&
      fileType !=
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      console.warn('Unsupported file type. Please upload a CSV or Excel file');
      logger.warn('Unsupported file type. Please upload a CSV or Excel file');

      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Unsupported file type. Please upload a CSV or Excel file',
      });
    }

    const requiredColumns = [
      'First Name',
      'Last Name',
      'Email',
      'Phone Number',
      'Mobile Number',
      'Title',
      'LinkedIn',
      'Location',
      'Department',
      'Language',
      'Manager Name',
      'Manager Email',
      'Employee Start Date',
      'Termination Date',
      'Group Name',
    ];

    const verifyColumns = (headers) => {
      const missingColumns = requiredColumns.filter(
        (column) => !headers.includes(column)
      );
      return { isValid: missingColumns.length === 0, missingColumns };
    };

    const parseCsvData = (data, callback) => {
      csv.parse(data, { columns: true }, callback);
    };

    const handleData = async (jsonData) => {
      const headers = Object.keys(jsonData[0]);
      const { isValid, missingColumns } = verifyColumns(headers);
      if (!isValid) {
        console.warn('File is missing required columns');
        logger.warn('File is missing required columns');

        return res.status(httpStatus.OK).json({
          message: 'CSV validation completed',
          missingColumns: missingColumns,
          duplicateUsersInDb: [],
          validationErrors: {},
        });
      }

      const duplicateRows = [];
      const uniqueEmails = new Set();
      const validationErrors = {};

      for (const row of jsonData) {
        const email = row['Email'];

        if (!email || !Object.values(row).some((value) => value)) {
          continue;
        }

        if (uniqueEmails.has(email)) {
          duplicateRows.push(row);
          continue;
        }

        uniqueEmails.add(email);

        const rowErrors = [];
        for (const [field, fieldValidators] of Object.entries(validators)) {
          const errors = validateField(row[field], fieldValidators, row);
          rowErrors.push(...errors);
        }

        if (rowErrors.length > 0) {
          validationErrors[email] = rowErrors;
        }
      }

      const existingUsers = await User.findAll({
        where: {
          email: Array.from(uniqueEmails),
          companyId: req.user.companyId,
        },
      });

      const existingEmails = existingUsers.map((user) => user.email);

      res.status(httpStatus.OK).json({
        message: 'CSV validation completed',
        missingColumns: [],
        duplicateUsersInDb: existingEmails,
        validationErrors: validationErrors,
      });
    };

    if (fileType === 'text/csv') {
      const rows = file.buffer.toString();

      parseCsvData(rows, (err, jsonData) => {
        if (err) {
          console.error('Error parsing CSV:', err);
          logger.error('Error parsing CSV:', err);

          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: 'Internal server error' });
        }
        handleData(jsonData);
      });
    } else {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = xlsx.utils.sheet_to_csv(sheet);

      parseCsvData(rows, (err, jsonData) => {
        if (err) {
          console.error('Error parsing CSV:', err);
          logger.error('Error parsing CSV:', err);

          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: 'Internal server error' });
        }
        handleData(jsonData);
      });
    }
  },

  populateEmployeeData: async (req, res) => {
    const file = req.file;
    const duplicateActions = JSON.parse(req.body.duplicateActions || '{}');

    if (!file) {
      console.warn('No file uploaded');
      logger.warn('No file uploaded');

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'No file uploaded' });
    }

    const fileType = file.mimetype;

    if (
      fileType != 'text/csv' &&
      fileType !=
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      console.warn('Unsupported file type. Please upload a CSV or Excel file');
      logger.warn('Unsupported file type. Please upload a CSV or Excel file');

      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Unsupported file type. Please upload a CSV or Excel file',
      });
    }

    const requiredColumns = [
      'First Name',
      'Last Name',
      'Email',
      'Phone Number',
      'Mobile Number',
      'Title',
      'LinkedIn',
      'Location',
      'Department',
      'Language',
      'Manager Name',
      'Manager Email',
      'Employee Start Date',
      'Termination Date',
      'Group Name',
    ];

    const verifyColumns = (headers) => {
      return requiredColumns.every((column) => headers.includes(column));
    };

    const parseCsvData = (data, callback) => {
      csv.parse(data, { columns: true }, callback);
    };

    const handleData = async (jsonData) => {
      const headers = Object.keys(jsonData[0]);
      if (!verifyColumns(headers)) {
        console.warn('File is missing required columns');
        logger.warn('File is missing required columns');

        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ error: 'File is missing required columns' });
      }

      const users = [];
      const managerMapping = {};
      const groupMapping = {};

      for (const row of jsonData) {
        const email = row['Email'];

        if (!email || !Object.values(row).some((value) => value)) {
          continue;
        }

        const user = {
          firstName: row['First Name'],
          lastName: row['Last Name'],
          email: email,
          phoneNumber: row['Phone Number'],
          mobileNumber: row['Mobile Number'],
          companyId: req.user.companyId,
          jobTitle: row['Title'],
          linkedin: row['LinkedIn'],
          location: row['Location'],
          department: row['Department'],
          language: row['Language'],
          managerName: row['Manager Name'],
          managerEmail: row['Manager Email'],
          role: process.env.COMPANY_EMPLOYEE,
          startDate: row['Employee Start Date']
            ? row['Employee Start Date']
            : null,
          endDate: row['Termination Date'] ? row['Termination Date'] : null,
        };

        users.push(user);
        if (user.managerEmail) {
          managerMapping[user.email] = user.managerEmail;
        }
        if (row['Group Name']) {
          groupMapping[user.email] = row['Group Name'];
        }
      }

      const transaction = await sequelize.transaction();
      try {
        const existingUsers = await User.findAll({
          where: {
            email: users.map((user) => user.email),
            companyId: req.user.companyId,
          },
          transaction,
        });

        const usersToCreate = [];
        const usersToUpdate = [];
        const failedUsers = [];

        for (const user of users) {
          const existingUser = existingUsers.find(
            (eu) => eu.email === user.email
          );
          if (existingUser) {
            const action = duplicateActions[user.email];
            if (action === 'Replace') {
              usersToUpdate.push({ ...user, id: existingUser.id });
            } else {
              failedUsers.push(user.email); // Skip
            }
          } else {
            usersToCreate.push(user);
          }
        }

        const createdUsers = await User.bulkCreate(usersToCreate, {
          transaction,
          ignoreDuplicates: true,
        });

        for (const user of usersToUpdate) {
          await User.update(user, {
            where: { id: user.id },
            transaction,
          });
        }

        const allUsers = await User.findAll({
          where: {
            email: users.map((user) => user.email),
            companyId: req.user.companyId,
          },
          transaction,
        });

        const emailToIdMap = allUsers.reduce((acc, user) => {
          acc[user.email] = user.id;
          return acc;
        }, {});

        const updatePromises = allUsers.map((user) => {
          if (managerMapping[user.email]) {
            const managerId = emailToIdMap[managerMapping[user.email]];
            if (managerId) {
              return user.update({ lineManagerId: managerId }, { transaction });
            }
          }
          return Promise.resolve();
        });

        await Promise.all(updatePromises);

        const groupPromises = allUsers.map(async (user) => {
          if (groupMapping[user.email]) {
            const [group, created] = await Group.findOrCreate({
              where: {
                name: groupMapping[user.email],
                companyId: req.user.companyId,
              },
              defaults: {
                name: groupMapping[user.email],
                companyId: req.user.companyId,
              },
              transaction,
            });
            await GroupMember.findOrCreate({
              where: {
                groupId: group.id,
                userId: user.id,
              },
              defaults: {
                groupId: group.id,
                userId: user.id,
              },
              transaction,
            });
          }
        });

        await Promise.all(groupPromises);
        await transaction.commit();

        for (const employee of createdUsers) {
          sendCompanyEmployeeSignUpEmail(
            employee,
            generateAccessToken(employee)
          );
        }

        return res.status(httpStatus.CREATED).json({
          message:
            'File uploaded and data stored in database successfully! A sign up email has been sent to all the new employees',
          createdUsers: createdUsers.map((user) => user.email),
          updatedUsers: usersToUpdate.map((user) => user.email),
          failedUsers,
        });
      } catch (error) {
        console.error('Error inserting or updating users:', error);
        logger.error('Error inserting or updating users:', error);

        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: 'Internal server error' });
      }
    };

    if (fileType === 'text/csv') {
      rows = file.buffer.toString();

      parseCsvData(rows, (err, jsonData) => {
        if (err) {
          console.error('Error parsing CSV:', err);
          logger.error('Error parsing CSV:', err);

          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: 'Internal server error' });
        }
        handleData(jsonData);
      });
    } else {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = xlsx.utils.sheet_to_csv(sheet);

      parseCsvData(rows, (err, jsonData) => {
        if (err) {
          console.error('Error parsing CSV:', err);
          logger.error('Error parsing CSV:', err);

          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: 'Internal server error' });
        }
        handleData(jsonData);
      });
    }
  },

  getMyCompany: async (req, res) => {
    const company = await Company.findByPk(req.user.companyId);

    if (!company) {
      console.warn('Company not found');
      logger.warn('Company not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Company not found' });
    }

    res.status(httpStatus.OK).json(company);
  },

  getAllCompanies: async (req, res) => {
    let queryFilters = {};

    const validColumns = ['id', 'name', 'industry', 'email', 'isActive'];
    validColumns.forEach((column) => {
      if (req.query[column]) {
        queryFilters[column] = req.query[column];
      }
    });

    const companies = await Company.findAll({
      where: queryFilters,
    });

    if (!companies && !companies.length) {
      console.warn('Companies not found');
      logger.warn('Companies not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Companies not found' });
    }

    res.status(httpStatus.OK).json(companies);
  },

  updateMyCompany: async (req, res) => {
    const {
      name,
      industry,
      email,
      address,
      contractStartDate,
      contractLength,
      currentMailBoxes,
      maxMailBoxes,
      chatgptIntegration,
      trainingVideos,
      smsPhishingSimulation,
      widget,
      rewards,
      price,
    } = req.body;

    const company = await Company.findByPk(req.user.companyId);

    if (!company) {
      console.warn('Company not found');
      logger.warn('Company not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Company not found' });
    }

    if (name) company.name = name;
    if (industry) company.industry = industry;
    if (email) company.email = email;
    if (address) company.address = address;
    if (contractStartDate) company.contractStartDate = contractStartDate;
    if (contractLength) company.contractLength = contractLength;
    if (currentMailBoxes) company.currentMailBoxes = currentMailBoxes;
    if (maxMailBoxes) company.maxMailBoxes = maxMailBoxes;
    if (chatgptIntegration !== undefined)
      company.chatgptIntegration = chatgptIntegration;
    if (trainingVideos !== undefined) company.trainingVideos = trainingVideos;
    if (smsPhishingSimulation !== undefined)
      company.smsPhishingSimulation = smsPhishingSimulation;
    if (widget !== undefined) company.widget = widget;
    if (rewards !== undefined) company.rewards = rewards;
    if (price) company.price = price;

    await company.save();

    Log.create({
      userId: req.user.id,
      action: process.env.COMPANY_UPDATE_ACTION,
      message: `Company with ID ${company.id} updated its data`,
    });

    res.status(httpStatus.OK).json({
      message: 'Company updated successfully',
      updatedCompany: company,
    });
  },

  updateCompany: async (req, res) => {
    const {
      name,
      industry,
      email,
      address,
      contractStartDate,
      contractLength,
      currentMailBoxes,
      maxMailBoxes,
      chatgptIntegration,
      trainingVideos,
      smsPhishingSimulation,
      widget,
      rewards,
      price,
    } = req.body;

    console.log(req.body);

    const company = await Company.findByPk(req.params.id);

    if (!company) {
      console.warn('Company not found');
      logger.warn('Company not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Company not found' });
    }

    if (name) company.name = name;
    if (industry) company.industry = industry;
    if (email) company.email = email;
    if (address) company.address = address;
    if (contractStartDate) company.contractStartDate = contractStartDate;
    if (contractLength) company.contractLength = contractLength;
    if (currentMailBoxes) company.currentMailBoxes = currentMailBoxes;
    if (maxMailBoxes) company.maxMailBoxes = maxMailBoxes;
    if (chatgptIntegration !== undefined)
      company.chatgptIntegration = chatgptIntegration;
    if (trainingVideos !== undefined) company.trainingVideos = trainingVideos;
    if (smsPhishingSimulation !== undefined)
      company.smsPhishingSimulation = smsPhishingSimulation;
    if (widget !== undefined) company.widget = widget;
    if (rewards !== undefined) company.rewards = rewards;
    if (price) company.price = price;

    await company.save();

    Log.create({
      userId: req.user.id,
      action: process.env.COMPANY_UPDATE_ACTION,
      message: `Company with ID ${company.id} updated`,
    });

    res.status(httpStatus.OK).json({
      message: 'Company updated successfully',
      updatedCompany: company,
    });
  },

  disableMyCompany: async (req, res) => {
    const company = await Company.findByPk(req.user.companyId);

    if (!company) {
      console.warn('Company not found');
      logger.warn('Company not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Company not found' });
    }

    company.isActive = false;

    await company.save();

    Log.create({
      userId: req.user.id,
      action: process.env.COMPANY_DISABLED_ACTION,
      message: `Company disabled with ID ${company.id} disabled itself`,
    });

    res.status(httpStatus.OK).json({
      message: 'Company disabled successfully',
    });
  },

  disableCompany: async (req, res) => {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      console.warn('Company not found');
      logger.warn('Company not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Company not found' });
    }

    company.isActive = false;

    await company.save();

    Log.create({
      userId: req.user.id,
      action: process.env.COMPANY_DISABLED_ACTION,
      message: `Company disabled with ID ${company.id}`,
    });

    res.status(httpStatus.OK).json({
      message: 'Company disabled successfully',
    });
  },

  enableCompany: async (req, res) => {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      console.warn('Company not found');
      logger.warn('Company not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Company not found' });
    }

    if (company.isActive) {
      console.warn('Company is already active');
      logger.warn('Company is already active');

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Company is already active' });
    }

    company.isActive = true;

    await company.save();

    Log.create({
      userId: req.user.id,
      action: process.env.COMPANY_ENABLED_ACTION,
      message: `Company enabled with ID ${company.id}`,
    });

    res.status(httpStatus.OK).json({
      message: 'Company disabled successfully',
    });
  },
};

module.exports = companyController;
