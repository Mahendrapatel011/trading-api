import location from './location.js';
import User from './User.js';
import Item from './Item.js';
import Unit from './Unit.js';
import RentRate from './RentRate.js';
import LoadingRate from './LoadingRate.js';
import UnloadingRate from './UnloadingRate.js';
import TaiyariRate from './TaiyariRate.js';
import InterestRate from './InterestRate.js';
import Supplier from './Supplier.js';
import Purchase from './Purchase.js';
import Sale from './Sale.js';
import Loan from './Loan.js';
import LotProcessing from './LotProcessing.js';
import LoanRepayment from './LoanRepayment.js';
import LotTransfer from './LotTransfer.js';



// Initialize associations
const initAssociations = () => {
  // location -> Supplier (One to Many)
  location.hasMany(Supplier, { foreignKey: 'locationId', as: 'suppliers' });
  Supplier.belongsTo(location, { foreignKey: 'locationId', as: 'location' });

  // location -> Purchase (One to Many)
  location.hasMany(Purchase, { foreignKey: 'locationId', as: 'purchases' });
  Purchase.belongsTo(location, { foreignKey: 'locationId', as: 'location' });

  // Supplier -> Purchase (One to Many)
  Supplier.hasMany(Purchase, { foreignKey: 'supplierId', as: 'purchases' });
  Purchase.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });

  // Supplier -> Purchase (purchasedFor relationship)
  Supplier.hasMany(Purchase, { foreignKey: 'purchasedForId', as: 'purchasedForPurchases' });
  Purchase.belongsTo(Supplier, { foreignKey: 'purchasedForId', as: 'purchasedFor' });

  // Item -> Purchase (One to Many)
  Item.hasMany(Purchase, { foreignKey: 'itemId', as: 'purchases' });
  Purchase.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

  Purchase.hasMany(Sale, { foreignKey: 'purchaseId', as: 'sales' });
  Sale.belongsTo(Purchase, { foreignKey: 'purchaseId', as: 'purchase' });

  // Purchase -> Loan (One to Many)
  Purchase.hasMany(Loan, { foreignKey: 'purchaseId', as: 'loans' });
  Loan.belongsTo(Purchase, { foreignKey: 'purchaseId', as: 'purchase' });

  // Purchase -> LotProcessing (One to Many)
  Purchase.hasMany(LotProcessing, { foreignKey: 'purchaseId', as: 'processings' });
  LotProcessing.belongsTo(Purchase, { foreignKey: 'purchaseId', as: 'purchase' });

  // Loan -> LoanRepayment (One to Many)
  Loan.hasMany(LoanRepayment, { foreignKey: 'loanId', as: 'repayments' });
  LoanRepayment.belongsTo(Loan, { foreignKey: 'loanId', as: 'loan' });

  // LotTransfer associations
  Purchase.hasMany(LotTransfer, { foreignKey: 'purchaseId', as: 'transfers' });
  LotTransfer.belongsTo(Purchase, { foreignKey: 'purchaseId', as: 'purchase' });
  LotTransfer.belongsTo(Supplier, { foreignKey: 'previousOwnerId', as: 'previousOwner' });
  LotTransfer.belongsTo(Supplier, { foreignKey: 'newOwnerId', as: 'newOwner' });
  location.hasMany(LotTransfer, { foreignKey: 'locationId', as: 'transfers' });
  LotTransfer.belongsTo(location, { foreignKey: 'locationId', as: 'location' });
};



export {
  location,
  User,
  Item,
  Unit,
  RentRate,
  LoadingRate,
  UnloadingRate,
  TaiyariRate,
  InterestRate,
  Supplier,
  Purchase,
  Sale,
  Loan,
  LotProcessing,
  LoanRepayment,
  LotTransfer,
  initAssociations,
};


export default {
  location,
  User,
  Item,
  Unit,
  RentRate,
  LoadingRate,
  UnloadingRate,
  TaiyariRate,
  InterestRate,
  Supplier,
  Purchase,
  Sale,
  Loan,
  LotProcessing,
  LoanRepayment,
  LotTransfer,
  initAssociations,
};

