import Joi from 'joi';

const saleValidator = {
    create: {
        body: Joi.object({
            purchaseId: Joi.number().integer().required(),
            saleDt: Joi.date().required(),
            party: Joi.string().required().trim(),
            nikashiPkt: Joi.number().integer().min(0).default(0),
            tayariPkt: Joi.number().integer().min(0).default(0),
            charri: Joi.number().precision(2).min(0).default(0),
            salePkt: Joi.number().integer().min(0).default(0),
            saleWt: Joi.number().precision(3).min(0).required(),
            rate: Joi.number().precision(2).min(0).required(),
            amount: Joi.number().precision(2).allow(null, ''),
            unloadingLabour: Joi.number().precision(2).min(0).default(0),
            tayaroLabour: Joi.number().precision(2).min(0).default(0),
            coldStorageRent: Joi.number().precision(2).min(0).default(0),
            newBags: Joi.number().integer().min(0).default(0),
            sutli: Joi.number().precision(2).min(0).default(0),
            pktCollection: Joi.number().precision(2).min(0).default(0),
            raffuChipri: Joi.number().precision(2).min(0).default(0),
            totalExpOnSales: Joi.number().precision(2).allow(null, ''),
            netResult: Joi.number().precision(2).allow(null, ''),
            shortage: Joi.number().precision(2).allow(null, ''),
        }),
    },

    update: {
        body: Joi.object({
            purchaseId: Joi.number().integer(),
            saleDt: Joi.date(),
            party: Joi.string().trim(),
            nikashiPkt: Joi.number().integer().min(0),
            tayariPkt: Joi.number().integer().min(0),
            charri: Joi.number().precision(2).min(0),
            salePkt: Joi.number().integer().min(0),
            saleWt: Joi.number().precision(3).min(0),
            rate: Joi.number().precision(2).min(0),
            unloadingLabour: Joi.number().precision(2).min(0),
            tayaroLabour: Joi.number().precision(2).min(0),
            coldStorageRent: Joi.number().precision(2).min(0),
            newBags: Joi.number().integer().min(0),
            sutli: Joi.number().precision(2).min(0),
            pktCollection: Joi.number().precision(2).min(0),
            raffuChipri: Joi.number().precision(2).min(0),
            isActive: Joi.boolean(),
            shortage: Joi.number().precision(2).allow(null, ''),
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

    getAll: {
        query: Joi.object({
            locationId: Joi.number().integer(),
            year: Joi.number().integer().min(2020).max(2100),
        }),
    },
};

export default saleValidator;
