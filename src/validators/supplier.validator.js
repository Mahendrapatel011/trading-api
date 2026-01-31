import Joi from 'joi';

const supplierValidator = {
    create: {
        body: Joi.object({
            name: Joi.string().required().trim(),
            mobileNo: Joi.string().allow('', null).trim(),
            whatsappNo: Joi.string().allow('', null).trim(),
            email: Joi.string().email().allow('', null).trim(),
            aadharCard: Joi.string().allow('', null).trim(),
            address: Joi.string().allow('', null).trim(),
            locationId: Joi.number().integer(),
            isActive: Joi.boolean().default(true),
        }),
    },

    update: {
        body: Joi.object({
            name: Joi.string().trim(),
            mobileNo: Joi.string().allow('', null).trim(),
            whatsappNo: Joi.string().allow('', null).trim(),
            email: Joi.string().email().allow('', null).trim(),
            aadharCard: Joi.string().allow('', null).trim(),
            address: Joi.string().allow('', null).trim(),
            locationId: Joi.number().integer(),
            isActive: Joi.boolean(),
        }).min(1),
    },

    getById: {
        params: Joi.object({
            id: Joi.number().integer().required(),
        }),
    },

    delete: {
        params: Joi.object({
            id: Joi.number().integer().required(),
        }),
    },
};

export default supplierValidator;
