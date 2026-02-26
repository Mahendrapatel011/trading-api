import { LotProcessing, Purchase } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from '../constants/httpStatus.js';


const createLotProcessing = async (processingData) => {
    const purchase = await Purchase.findByPk(processingData.purchaseId);
    if (!purchase) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
    }

    // Check if processing already exists for this lot
    let lotProcessing = await LotProcessing.findOne({
        where: { purchaseId: processingData.purchaseId, isActive: true }
    });

    if (lotProcessing) {
        // INCREMENTAL UPDATE: Add new values to existing ones
        const updateData = {
            nikashiPkt: (parseInt(lotProcessing.nikashiPkt) || 0) + (parseInt(processingData.nikashiPkt) || 0),
            purchaseCost: lotProcessing.purchaseCost, // Stay constant as per user request
            nikashiLabour: (parseFloat(lotProcessing.nikashiLabour) || 0) + (parseFloat(processingData.nikashiLabour) || 0),
            tayariLabour: (parseFloat(lotProcessing.tayariLabour) || 0) + (parseFloat(processingData.tayariLabour) || 0),
            rent: (parseFloat(lotProcessing.rent) || 0) + (parseFloat(processingData.rent) || 0),
            newBags: (parseFloat(lotProcessing.newBags) || 0) + (parseFloat(processingData.newBags) || 0),
            sutli: (parseFloat(lotProcessing.sutli) || 0) + (parseFloat(processingData.sutli) || 0),
            pktCollection: (parseFloat(lotProcessing.pktCollection) || 0) + (parseFloat(processingData.pktCollection) || 0),
            raffuChippi: (parseFloat(lotProcessing.raffuChippi) || 0) + (parseFloat(processingData.raffuChippi) || 0),
            tayariPkt: (parseInt(lotProcessing.tayariPkt) || 0) + (parseInt(processingData.tayariPkt) || 0),
            tayariWt: (parseFloat(lotProcessing.tayariWt) || 0) + (parseFloat(processingData.tayariWt) || 0),
            charriPkt: (parseInt(lotProcessing.charriPkt) || 0) + (parseInt(processingData.charriPkt) || 0),
            charriWt: (parseFloat(lotProcessing.charriWt) || 0) + (parseFloat(processingData.charriWt) || 0),
            processingDate: processingData.processingDate || lotProcessing.processingDate // Keep latest date
        };

        // Recalculate totalExps
        updateData.totalExps =
            parseFloat(updateData.purchaseCost) +
            parseFloat(updateData.nikashiLabour) +
            parseFloat(updateData.tayariLabour) +
            parseFloat(updateData.rent) +
            parseFloat(updateData.newBags) +
            parseFloat(updateData.sutli) +
            parseFloat(updateData.pktCollection) +
            parseFloat(updateData.raffuChippi);

        await lotProcessing.update(updateData);
    } else {
        // NEW RECORD: Calculate totalExps
        const totalExps =
            parseFloat(processingData.purchaseCost || 0) +
            parseFloat(processingData.nikashiLabour || 0) +
            parseFloat(processingData.tayariLabour || 0) +
            parseFloat(processingData.rent || 0) +
            parseFloat(processingData.newBags || 0) +
            parseFloat(processingData.sutli || 0) +
            parseFloat(processingData.pktCollection || 0) +
            parseFloat(processingData.raffuChippi || 0);

        lotProcessing = await LotProcessing.create({
            ...processingData,
            totalExps,
        });
    }

    return lotProcessing;
};

const queryLotProcessings = async (filter = {}) => {
    const lotProcessings = await LotProcessing.findAll({
        where: { ...filter, isActive: true },
        include: [
            {
                model: Purchase,
                as: 'purchase',
            },
        ],
        order: [['processingDate', 'ASC'], ['id', 'ASC']],
    });
    return lotProcessings;
};

const getLotProcessingById = async (id) => {
    const lotProcessing = await LotProcessing.findByPk(id, {
        include: [
            {
                model: Purchase,
                as: 'purchase',
            },
        ],
    });
    if (!lotProcessing) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lot processing record not found');
    }
    return lotProcessing;
};

const getLotProcessingsByPurchaseId = async (purchaseId) => {
    return await LotProcessing.findAll({
        where: { purchaseId, isActive: true },
        order: [['processingDate', 'ASC'], ['id', 'ASC']],
    });
};

const updateLotProcessingById = async (id, updateBody) => {
    const lotProcessing = await getLotProcessingById(id);

    // Recalculate totalExps if any component is updated
    if (
        updateBody.purchaseCost !== undefined ||
        updateBody.nikashiLabour !== undefined ||
        updateBody.tayariLabour !== undefined ||
        updateBody.rent !== undefined ||
        updateBody.newBags !== undefined ||
        updateBody.sutli !== undefined ||
        updateBody.pktCollection !== undefined ||
        updateBody.raffuChippi !== undefined
    ) {
        const pc = updateBody.purchaseCost !== undefined ? updateBody.purchaseCost : lotProcessing.purchaseCost;
        const nl = updateBody.nikashiLabour !== undefined ? updateBody.nikashiLabour : lotProcessing.nikashiLabour;
        const tl = updateBody.tayariLabour !== undefined ? updateBody.tayariLabour : lotProcessing.tayariLabour;
        const r = updateBody.rent !== undefined ? updateBody.rent : lotProcessing.rent;
        const nb = updateBody.newBags !== undefined ? updateBody.newBags : lotProcessing.newBags;
        const s = updateBody.sutli !== undefined ? updateBody.sutli : lotProcessing.sutli;
        const pc2 = updateBody.pktCollection !== undefined ? updateBody.pktCollection : lotProcessing.pktCollection;
        const rc = updateBody.raffuChippi !== undefined ? updateBody.raffuChippi : lotProcessing.raffuChippi;

        updateBody.totalExps =
            parseFloat(pc) + parseFloat(nl) + parseFloat(tl) + parseFloat(r) +
            parseFloat(nb) + parseFloat(s) + parseFloat(pc2) + parseFloat(rc);
    }

    Object.assign(lotProcessing, updateBody);
    await lotProcessing.save();
    return lotProcessing;
};

const deleteLotProcessingById = async (id) => {
    const lotProcessing = await getLotProcessingById(id);
    lotProcessing.isActive = false;
    await lotProcessing.save();
    return lotProcessing;
};

export default {
    createLotProcessing,
    queryLotProcessings,
    getLotProcessingById,
    getLotProcessingsByPurchaseId,
    updateLotProcessingById,
    deleteLotProcessingById,
};
