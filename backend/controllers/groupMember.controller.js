const logger = require('../startup/logging');
const httpStatus = require('http-status-codes').StatusCodes;
const {
  GroupMember,
  validateGroupMember,
} = require('../models/groupMember.model');
const { Log } = require('../models/log.model');
const { Group } = require('../models/group.model');
const { User } = require('../models/user.model');

const groupMemberController = {
  addGroupMember: async (req, res) => {
    const { groupId, userIds } = req.body;

    const { error } = validateGroupMember(req.body);

    if (error) {
      console.warn(`Invalid data format: ${error}`);
      logger.warn(`Invalid data format: ${error}`);

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: `Invalid data format: ${error}` });
    }

    const group = await Group.findOne({
      where: {
        id: groupId,
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

    const users = await User.findAll({
      where: {
        id: userIds,
        companyId: req.user.companyId,
      },
    });

    if (users.length !== userIds.length) {
      console.warn(
        'One or more users not found or do not belong to the same company'
      );
      logger.warn(
        'One or more users not found or do not belong to the same company'
      );

      return res.status(httpStatus.NOT_FOUND).json({
        error:
          'One or more users not found or do not belong to the same company',
      });
    }

    const groupMembers = await Promise.all(
      userIds.map(async (userId) => {
        return GroupMember.create({
          groupId,
          userId,
        });
      })
    );

    Log.create({
      userId: req.user.id,
      action: process.env.ADD_GROUP_MEMBER_ACTION,
      message: `Group members added to group with ID ${group.id}`,
    });

    res.status(httpStatus.CREATED).json({
      message: 'Users added to group successfully',
      groupMembers,
    });
  },

  getGroupMembers: async (req, res) => {
    const { id } = req.params;

    const group = await Group.findOne({
      where: {
        id,
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

    const groupMembers = await GroupMember.findAll({
      where: {
        groupId: id,
      },
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email'],
        },
      ],
    });

    res.status(httpStatus.OK).json(groupMembers);
  },

  removeGroupMember: async (req, res) => {
    const { groupId, userId } = req.body;

    const group = await Group.findOne({
      where: {
        id: groupId,
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

    const groupMember = await GroupMember.findOne({
      where: {
        groupId,
        userId,
      },
    });

    if (!groupMember) {
      console.warn('Group member not found');
      logger.warn('Group member not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Group member not found' });
    }

    await groupMember.destroy();

    Log.create({
      userId: req.user.id,
      action: process.env.REMOVE_GROUP_MEMBER_ACTION,
      message: `Group members removed from group with ID ${group.id}`,
    });

    res.status(httpStatus.OK).json({
      message: 'Users removed from group successfully',
    });
  },
};

module.exports = groupMemberController;
