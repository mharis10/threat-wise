const { User } = require('./user.model');
const { Company } = require('./company.model');
const { Group } = require('./group.model');
const { GroupMember } = require('./groupMember.model');
const { LoginAudit } = require('./loginAudit.model');
const { RefreshToken } = require('./refreshToken.model');
const { Log } = require('./log.model');
const { EmailTemplate } = require('./emailTemplate.model');
const { Campaign } = require('./campaign.model');
const { CampaignRecipient } = require('./campaignRecipient.model');
const { CampaignStat } = require('./campaignStat.model');
const { UserStat } = require('./userStat.model');

Company.hasMany(User, { foreignKey: 'companyId' });
User.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(Group, { foreignKey: 'companyId' });
Group.belongsTo(Company, { foreignKey: 'companyId' });

Group.hasMany(GroupMember, { foreignKey: 'groupId' });
GroupMember.belongsTo(Group, { foreignKey: 'groupId' });

User.hasMany(GroupMember, { foreignKey: 'userId' });
GroupMember.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(EmailTemplate, { foreignKey: 'userId' });
EmailTemplate.belongsTo(User, { foreignKey: 'userId' });

Company.hasMany(Campaign, { foreignKey: 'companyId' });
Campaign.belongsTo(Company, { foreignKey: 'companyId' });

Campaign.hasMany(CampaignRecipient, { foreignKey: 'campaignId' });
CampaignRecipient.belongsTo(Campaign, { foreignKey: 'campaignId' });

User.hasMany(CampaignRecipient, { foreignKey: 'userId' });
CampaignRecipient.belongsTo(User, { foreignKey: 'userId' });

Campaign.hasOne(CampaignStat, { foreignKey: 'campaignId' });
CampaignStat.belongsTo(Campaign, { foreignKey: 'campaignId' });

User.hasMany(LoginAudit, { foreignKey: 'userId' });
LoginAudit.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Log, { foreignKey: 'userId' });
Log.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(User, { as: 'Subordinates', foreignKey: 'lineManagerId' });
User.belongsTo(User, { as: 'LineManager', foreignKey: 'lineManagerId' });

User.hasOne(UserStat, { foreignKey: 'userId' });
UserStat.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Company,
  Group,
  GroupMember,
  EmailTemplate,
  Campaign,
  LoginAudit,
  RefreshToken,
  Log,
  UserStat,
};
