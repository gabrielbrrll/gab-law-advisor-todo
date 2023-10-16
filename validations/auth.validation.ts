import Joi from 'joi';

const register = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
    'string.pattern.base':
      'Password should only contain alphanumeric characters and be between 3 to 30 characters long.'
  })
});

const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

export default {
  register,
  login
};
