const Joi = require('joi');

const Authentication = {
  validateAuth: (account) => {
    const authSchema = Joi.object({
      email: Joi.string().email().max(100).required(),
      password: Joi.string().max(100).required(),
    });

    return authSchema.validate(account);
  },
};

module.exports = Authentication;
