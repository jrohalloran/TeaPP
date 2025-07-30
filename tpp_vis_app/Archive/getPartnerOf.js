
/*** 
 * // Date: 08/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/


import express from 'express';
import { getPartnerOf} from '../controllers/getPartnerOfController.js';

const router = express.Router();


router.post('/getPartnerOf', getPartnerOf);


export default router;