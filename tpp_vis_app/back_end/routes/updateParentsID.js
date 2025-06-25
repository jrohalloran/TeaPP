/*** 
 * // Date: 25/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/


import express from 'express';
import { updateParents } from '../controllers/updateParentIDController.js';

const router = express.Router();

router.post('/updateParents', updateParents);

export default router;