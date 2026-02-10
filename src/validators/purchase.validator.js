import Joi from 'joi';

const purchaseValidator = {
    create: {
        body: Joi.object({
            locationId: Joi.number().integer(),
            year: Joi.number().integer().min(2020).max(2100),
            billDate: Joi.date().required(),
            billNo: Joi.string().allow('', null).trim(), // Auto-generated if not provided
            supplierId: Joi.number().integer().required(),
            purchasedForId: Joi.alternatives().try(
                Joi.number().integer(),
                Joi.string().allow('', null),
                Joi.any().valid(null)
            ).optional(),
            itemId: Joi.number().integer().required(),
            agreementNo: Joi.string().required().trim(),
            noOfPacket: Joi.number().integer().min(1).required(),
            grWt: Joi.number().precision(3).min(0).required(),
            cutting: Joi.number().precision(3).min(0).default(0),
            netWt: Joi.number().precision(3).allow(null, ''),
            rate: Joi.number().precision(2).min(0).required(),
            amount: Joi.number().precision(2).allow(null, ''),
            loadingLabour: Joi.number().precision(2).min(0).default(0),
            totalCost: Joi.number().precision(2).allow(null, ''),
        }),
    },

    update: {
        body: Joi.object({
            billDate: Joi.date(),
            billNo: Joi.string().trim(),
            supplierId: Joi.number().integer(),
            purchasedForId: Joi.alternatives().try(
                Joi.number().integer(),
                Joi.string().allow('', null),
                Joi.any().valid(null)
            ).optional(),
            itemId: Joi.number().integer(),
            agreementNo: Joi.string().trim(),
            noOfPacket: Joi.number().integer().min(1),
            grWt: Joi.number().precision(3).min(0),
            cutting: Joi.number().precision(3).min(0),
            netWt: Joi.number().precision(3).allow(null, ''),
            rate: Joi.number().precision(2).min(0),
            amount: Joi.number().precision(2).allow(null, ''),
            loadingLabour: Joi.number().precision(2).min(0),
            totalCost: Joi.number().precision(2).allow(null, ''),
            year: Joi.number().integer().min(2020).max(2100),
            isActive: Joi.boolean(),
        }).min(1),
    },

    getById: {
        params: Joi.object({
            id: Joi.number().integer().required(),
        }),
        query: Joi.object({
            year: Joi.number().integer().min(2020).max(2100),
        }),
    },

    delete: {
        params: Joi.object({
            id: Joi.number().integer().required(),
        }),
        query: Joi.object({
            year: Joi.number().integer().min(2020).max(2100),
        }),
    },

    getAll: {
        query: Joi.object({
            year: Joi.number().integer().min(2020).max(2100),
        }),
    },

    generateBillNo: {
        query: Joi.object({
            year: Joi.number().integer().min(2020).max(2100),
        }),
        body: Joi.object({
            locationId: Joi.number().integer(), // For super admin
        }),
    },
};

export default purchaseValidator;
