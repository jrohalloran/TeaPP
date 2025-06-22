/*** 
 * // Date: 22/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import {getCleanData} from '../controllers/getCleanDataController.js';

const router = express.Router();


router.post('/getCleanData', getCleanData)

export default router;