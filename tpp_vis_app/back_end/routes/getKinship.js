/*** 
 * // Date: 27/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import {getKinship} from '../controllers/getKinshipController.js';

const router = express.Router();


router.get('/getKinship', getKinship)

export default router;