import Joi from 'joi';

const interestRateValidator = {
    create: {
        body: Joi.object().keys({
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

export default interestRateValidator;
