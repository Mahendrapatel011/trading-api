const messages = {
    // General
    SUCCESS: 'Success',
    CREATED: 'Created successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
    NOT_FOUND: 'Resource not found',
    ALREADY_EXISTS: 'Resource already exists',
    INVALID_ID: 'Invalid ID format',
    
    // Reservation
    RESERVATION: {
      NOT_FOUND: 'Reservation not found',
      CREATED: 'Reservation created successfully',
      UPDATED: 'Reservation updated successfully',
      DELETED: 'Reservation deleted successfully',
      PARTY_REQUIRED: 'Party name is required',
      DELIVERY_POINT_REQUIRED: 'Delivery point is required',
    },
    
    // Delivery Point
    DELIVERY_POINT: {
      NOT_FOUND: 'Delivery point not found',
      ALREADY_EXISTS: 'Delivery point already exists',
      CREATED: 'Delivery point created successfully',
      UPDATED: 'Delivery point updated successfully',
      DELETED: 'Delivery point deleted successfully',
    },
    
    // Item
    ITEM: {
      NOT_FOUND: 'Item not found',
      ALREADY_EXISTS: 'Item already exists',
      CREATED: 'Item created successfully',
      UPDATED: 'Item updated successfully',
      DELETED: 'Item deleted successfully',
    },
    
    // Mark
    MARK: {
      NOT_FOUND: 'Mark not found',
      ALREADY_EXISTS: 'Mark already exists',
      CREATED: 'Mark created successfully',
      UPDATED: 'Mark updated successfully',
      DELETED: 'Mark deleted successfully',
    },
    
    // Agent
    AGENT: {
      NOT_FOUND: 'Agent not found',
      ALREADY_EXISTS: 'Agent already exists',
      CREATED: 'Agent created successfully',
      UPDATED: 'Agent updated successfully',
      DELETED: 'Agent deleted successfully',
    },
    
    // Agreement
    AGREEMENT: {
      NOT_FOUND: 'Agreement not found',
      CREATED: 'Agreement created successfully',
      UPDATED: 'Agreement updated successfully',
      DELETED: 'Agreement deleted successfully',
      PARTY_REQUIRED: 'Party name is required',
      RESERVATION_REQUIRED: 'Reservation ID is required',
      LOCKED: 'Agreement is locked and cannot be modified',
    },
    
    // Chamber
    CHAMBER: {
      NOT_FOUND: 'Chamber entry not found',
      CREATED: 'Chamber entry created successfully',
      UPDATED: 'Chamber entry updated successfully',
      DELETED: 'Chamber entry deleted successfully',
      AGREEMENT_REQUIRED: 'Agreement ID is required',
      ALREADY_EXISTS: 'Chamber entry already exists for this agreement',
    },
    
    // Partial Delivery
    PARTIAL_DELIVERY: {
      NOT_FOUND: 'Partial delivery not found',
      CREATED: 'Partial delivery created successfully',
      UPDATED: 'Partial delivery updated successfully',
      DELETED: 'Partial delivery deleted successfully',
      AGREEMENT_REQUIRED: 'Agreement ID is required',
    },
  };
  
  export default messages;