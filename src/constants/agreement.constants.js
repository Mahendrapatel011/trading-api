const agreementConstants = {
  STATUS: {
    ACTIVE: 'active',
    LOCKED: 'locked',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
  },
  
  COUNTER_KEY: 'agreementNo',
  
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 500,
  
  SEARCH_MIN_LENGTH: 2,
  SEARCH_MAX_RESULTS: 15,
};

export default agreementConstants; 

