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

// Initialize associations
const initAssociations = () => {
  // location -> Supplier (One to Many)
  location.hasMany(Supplier, { foreignKey: 'locationId', as: 'suppliers' });
  Supplier.belongsTo(location, { foreignKey: 'locationId', as: 'location' });
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
  initAssociations,
};
