/*** 
 * // Date: 02/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import { getUserDetails } from '../controllers/getUserDetailsController.js';
import { setUserDetails} from '../controllers/setUserDetailsController.js';

const router = express.Router();

router.post('/getUserDetails', getUserDetails);

router.post('/setUserDetails', setUserDetails);


export default router;