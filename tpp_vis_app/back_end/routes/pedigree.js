/*** 
 * // Date: 06/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import { getPedigree } from '../controllers/pedigreeController.js';

const router = express.Router();

router.post('/getPedigree', getPedigree);

export default router;