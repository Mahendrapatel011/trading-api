import Joi from 'joi';

const itemValidator = {
  create: {
    body: Joi.object().keys({
      name: Joi.string().required().trim().min(2).max(100),
      code: Joi.string().allow('').optional().trim().min(1).max(20).uppercase(),
      description: Joi.string().allow('').optional().trim().max(500),
      isActive: Joi.boolean().default(true),
    }),
  },

  update: {
    params: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
    body: Joi.object()
      .keys({
        name: Joi.string().optional().trim().min(2).max(100),
        code: Joi.string().optional().trim().min(1).max(20).uppercase(),
        description: Joi.string().allow('').optional().trim().max(500),
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

export default itemValidator;