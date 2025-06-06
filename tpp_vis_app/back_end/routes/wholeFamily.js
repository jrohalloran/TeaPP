/*** 
 * // Date: 06/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import { getWholeFamily } from '../controllers/wholeFamilyController.js';

const router = express.Router();

router.post('/getWholeFamily', getWholeFamily);

export default router;