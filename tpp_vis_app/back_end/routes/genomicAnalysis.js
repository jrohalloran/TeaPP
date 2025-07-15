/*** 
 * // Date: 15/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import {getGenomicData} from '../controllers/getGenomicDataController.js';
import {processGenomFile} from '../controllers/processGenomeFileController.js';

const router = express.Router();

router.get('/getGenomicData', getGenomicData)

router.post('/processGenomFile', processGenomFile)

export default router;