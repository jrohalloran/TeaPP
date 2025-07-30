/*** 
 * // Date: 27/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import {performKinship} from '../controllers/performKinshipController.js';

const router = express.Router();


router.post('/performKinship', performKinship)

export default router;