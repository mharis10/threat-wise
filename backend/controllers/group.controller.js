const logger = require('../startup/logging');
const httpStatus = require('http-status-codes').StatusCodes;
const { Group, validateGroup } = require('../models/group.model');
const { Log } = require('../models/log.model');

const groupController = {
  createGroup: async (req, res) => {
    const { name } = req.body;

    const { error } = validateGroup(req.body);

    if (error) {
      console.warn(`Invalid data format: ${error}`);
      logger.warn(`Invalid data format: ${error}`);

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: `Invalid data format: ${error}` });
    }

    const [newGroup, created] = await Group.findOrCreate({
      where: {
        companyId: req.user.companyId,
        name,
      },
      defaults: {
        companyId: req.user.companyId,
        name,
      },
    });

    if (!created) {
      console.warn('Group already created');
      logger.warn('Group already created');

      return res
        .status(httpStatus.CONFLICT)
        .json({ error: 'Group already created' });
    }

    Log.create({
      userId: req.user.id,
      action: process.env.CREATE_GROUP_ACTION,
      message: `Group created with ID ${newGroup.id}`,
    });

    res.status(httpStatus.CREATED).json({
      message: 'Group created successfully!',
      group: newGroup,
    });
  },

  getMyGroups: async (req, res) => {
    let queryFilters = {
      companyId: req.user.companyId,
    };

    const validColumns = ['id', 'name'];
    validColumns.forEach((column) => {
      if (req.query[column]) {
        queryFilters[column] = req.query[column];
      }
    });

    const groups = await Group.findAll({
      where: queryFilters,
    });

    if (!groups && !groups.length) {
      console.warn('Groups not found');
      logger.warn('Groups not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Groups not found' });
    }

    res.status(httpStatus.OK).json(groups);
  },

  updateMyGroup: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const group = await Group.findOne({
      where: {
        id: id,
        companyId: req.user.companyId,
      },
    });

    if (!group) {
      console.warn('Group not found');
      logger.warn('Group not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Group not found' });
    }

    if (name) group.name = name;

    await group.save();

    Log.create({
      userId: req.user.id,
      action: process.env.UPDATE_GROUP_ACTION,
      message: `Group with ID ${group.id} updated its data`,
    });

    res.status(httpStatus.OK).json({
      message: 'Group updated successfully',
      group,
    });
  },

  deleteMyGroup: async (req, res) => {
    const { id } = req.params;

    const group = await Group.findOne({
      where: {
        id: id,
        companyId: req.user.companyId,
      },
    });

    if (!group) {
      console.warn('Group not found');
      logger.warn('Group not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Group not found' });
    }

    await group.destroy();

    await Log.create({
      userId: req.user.id,
      action: process.env.DELETE_GROUP_ACTION,
      message: `Group with ID ${group.id} deleted`,
    });

    res.status(httpStatus.OK).json({
      message: 'Group deleted successfully',
    });
  },
};

module.exports = groupController;
