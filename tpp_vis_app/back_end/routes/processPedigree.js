/*** 
 * // Date: 23/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import {processPedigree} from '../controllers/processPedigreeController.js';

const router = express.Router();

router.post('/processPedigree', processPedigree);


export default router;