
/*** 
 * // Date: 08/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/


import express from 'express';
import { getPlants} from '../controllers/allPlantPGController.js';

const router = express.Router();


router.get('/getAllPlants', getPlants);


export default router;
