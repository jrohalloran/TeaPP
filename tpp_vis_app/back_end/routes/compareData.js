/*** 
 * // Date: 20/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import {compareData} from '../controllers/compareDataController.js';

const router = express.Router();


router.post('/compareData', compareData)

export default router;