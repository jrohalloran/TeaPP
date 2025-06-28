/*** 
 * // Date: 23/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import {insertNeo4jDB} from '../controllers/insertNeo4jController.js';
import {insertADMINNeo4jDB} from '../controllers/insertADMINNeo4j.js';

const router = express.Router();

router.get('/insertNeo4j', insertNeo4jDB);

router.get('/insertAdminNeo4j', insertADMINNeo4jDB);

export default router;