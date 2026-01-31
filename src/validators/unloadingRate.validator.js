import Joi from 'joi';

const unloadingRateValidator = {
    create: {
        body: Joi.object().keys({
            itemId: Joi.number().integer().required(),
            unitId: Joi.number().integer().required(),
            locationId: Joi.number().integer().required(),
            rate: Joi.number().min(0).required(),
            isActive: Joi.boolean().default(true),
        }),
    },
    update: {
        params: Joi.object().keys({
            id: Joi.number().integer().required(),
        }),
        body: Joi.object().keys({
            itemId: Joi.number().integer().optional(),
            unitId: Joi.number().integer().optional(),
            locationId: Joi.number().integer().optional(),
            rate: Joi.number().min(0).optional(),
            isActive: Joi.boolean().optional(),
        }).min(1),
    },
    delete: {
        params: Joi.object().keys({
            id: Joi.number().integer().required(),
        }),
    },
};

export default unloadingRateValidator;
