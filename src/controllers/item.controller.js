import itemService from '../services/item.service.js';
import messages from '../constants/messages.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import httpStatus from '../constants/httpStatus.js';

const itemController = {
  /**
   * Create item (global - available for all locations)
   * POST /api/items
   */
  create: asyncHandler(async (req, res) => {
    const item = await itemService.create(req.body);
    return ApiResponse.created(res, item, messages.ITEM.CREATED);
  }),

  /**
   * Update item
   * PUT /api/items/:id
   */
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const item = await itemService.update(parseInt(id), req.body);
    return ApiResponse.success(res, item, messages.ITEM.UPDATED);
  }),

  /**
   * Delete item
   * DELETE /api/items/:id
   */
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await itemService.delete(parseInt(id));
    return ApiResponse.success(res, null, messages.ITEM.DELETED);
  }),

  /**
   * Get all active items (global - available for all locations)
   * GET /api/items
   */
  getAll: asyncHandler(async (req, res) => {
    const items = await itemService.getAll();
    return ApiResponse.success(res, items);
  }),

  /**
   * Get all items for admin (including inactive)
   * GET /api/items/admin/all
   */
  getAllAdmin: asyncHandler(async (req, res) => {
    const items = await itemService.getAllForSuperAdmin();
    return ApiResponse.success(res, items);
  }),

  /**
   * Get item by ID
   * GET /api/items/:id
   */
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const allItems = await itemService.getAllForSuperAdmin();
    const item = allItems.find(i => i.id === parseInt(id));
    if (!item) {
      return ApiResponse.error(res, httpStatus.NOT_FOUND, 'Item not found');
    }
    return ApiResponse.success(res, item);
  }),
};

export default itemController;
