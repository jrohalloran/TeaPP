/*** 
 * // Date: 03/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import {getRainfallStats} from '../controllers/getRainfallStatsController.js';
import { processRainfall } from '../controllers/insertRainfallController.js';

const router = express.Router();

router.get('/getRainfallStats', getRainfallStats)

router.get('/processRainfallFile',processRainfall)

export default router;