import Customer from '../models/customer.model.js';
import { errorHandler } from '../utils/error.js';

export const createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    return res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(errorHandler(404, 'Customer not found!'));
  }

  if (req.user.id !== customer.userRef) {
    return next(errorHandler(401, 'You can only delete your own customers!'));
  }

  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.status(200).json('Customer has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return next(errorHandler(404, 'Customer not found!'));
  }
  if (req.user.id !== customer.userRef) {
    return next(errorHandler(401, 'You can only update your own customers!'));
  }

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    next(error);
  }
};

export const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return next(errorHandler(404, 'Customer not found!'));
    }
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';
    
    const city = req.query.city || '';

    const basebuildingAreaDropdown = req.query.basebuildingAreaDropdown || 'bigger'; 
    const basebuildingAreaFromQuery = req.query.basebuildingArea || 0; 
    const basebuildingAreaMin = (basebuildingAreaDropdown === 'bigger') ? basebuildingAreaFromQuery : 0;
    const basebuildingAreaMax = (basebuildingAreaDropdown === 'smaller') ? basebuildingAreaFromQuery : 1000000;




    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const customers = await Customer.find({
      name: { $regex: searchTerm, $options: 'i' },
      city: { $regex: city, $options: 'i' },     
      buildingArea: { $lte: basebuildingAreaMax, $gte:basebuildingAreaMin},  // gte = greater than
      offer,
      // furnished,
      // parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};