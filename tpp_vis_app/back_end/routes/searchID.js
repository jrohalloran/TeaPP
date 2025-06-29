/*** 
 * // Date: 29/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import {searchID} from '../controllers/searchIDController.js';

const router = express.Router();

router.post('/searchID', searchID);


export default router;