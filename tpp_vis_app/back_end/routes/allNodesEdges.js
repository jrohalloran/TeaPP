/*** 
 * // Date: 07/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import { getAllNodesEdges} from '../controllers/allNodesEdgesController.js';

const router = express.Router();

router.get('/getAllNodesEdges', getAllNodesEdges);

export default router;