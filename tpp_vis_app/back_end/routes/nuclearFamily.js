/*** 
 * // Date: 06/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import { getNuclearFamily } from '../controllers/nuclearFamilyController.js';

const router = express.Router();

router.post('/getNuclearFamily2', getNuclearFamily);

export default router;