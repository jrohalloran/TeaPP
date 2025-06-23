/*** 
 * // Date: 23/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import {insertNeo4jDB} from '../controllers/insertNeo4jController.js';

const router = express.Router();

router.get('/insertNeo4j', insertNeo4jDB);


export default router;