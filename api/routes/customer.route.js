import express from 'express';
import { createCustomer, deleteCustomer, updateCustomer, getCustomer, getCustomers } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createCustomer);
router.delete('/delete/:id', verifyToken, deleteCustomer);
router.post('/update/:id', verifyToken, updateCustomer);
router.get('/get/:id', getCustomer);
router.get('/get', getCustomers);

export default router;