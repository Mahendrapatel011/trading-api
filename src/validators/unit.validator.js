import Joi from 'joi';

const unitValidator = {
  create: {
    body: Joi.object().keys({
      name: Joi.string().required().trim().min(1).max(50),
      isActive: Joi.boolean().default(true),
    }),
  },

  update: {
    params: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
    body: Joi.object()
      .keys({
        name: Joi.string().optional().trim().min(1).max(50),
        isActive: Joi.boolean().optional(),
      })
      .min(1),
  },

  getById: {
    params: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
  },

  delete: {
    params: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
  },
};

export default unitValidator;

