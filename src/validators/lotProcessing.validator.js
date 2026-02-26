import Joi from 'joi';

const lotProcessingValidator = {
    create: {
        body: Joi.object({
            purchaseId: Joi.number().integer().required(),
            processingDate: Joi.date().required(),
            nikashiPkt: Joi.number().integer().min(0).required(),
            purchaseCost: Joi.number().precision(2).min(0).default(0),
            nikashiLabour: Joi.number().precision(2).min(0).default(0),
            tayariLabour: Joi.number().precision(2).min(0).default(0),
            rent: Joi.number().precision(2).min(0).default(0),
            newBags: Joi.number().precision(2).min(0).default(0),
            sutli: Joi.number().precision(2).min(0).default(0),
            pktCollection: Joi.number().precision(2).min(0).default(0),
            raffuChippi: Joi.number().precision(2).min(0).default(0),
            totalExps: Joi.number().precision(2).min(0).default(0),
            tayariPkt: Joi.number().integer().min(0).required(),
            tayariWt: Joi.number().precision(3).min(0).default(0),
            charriPkt: Joi.number().integer().min(0).required(),
            charriWt: Joi.number().precision(3).min(0).default(0),
        }),
    },

    update: {
        body: Joi.object({
            processingDate: Joi.date(),
            purchaseId: Joi.number().integer(),
            nikashiPkt: Joi.number().integer().min(0),
            purchaseCost: Joi.number().precision(2).min(0),
            nikashiLabour: Joi.number().precision(2).min(0),
            tayariLabour: Joi.number().precision(2).min(0),
            rent: Joi.number().precision(2).min(0),
            newBags: Joi.number().precision(2).min(0),
            sutli: Joi.number().precision(2).min(0),
            pktCollection: Joi.number().precision(2).min(0),
            raffuChippi: Joi.number().precision(2).min(0),
            totalExps: Joi.number().precision(2).min(0),
            tayariPkt: Joi.number().integer().min(0),
            tayariWt: Joi.number().precision(3).min(0),
            charriPkt: Joi.number().integer().min(0),
            charriWt: Joi.number().precision(3).min(0),
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

    getByPurchase: {
        params: Joi.object({
            purchaseId: Joi.number().integer().required(),
        }),
    },
};

export default lotProcessingValidator;
