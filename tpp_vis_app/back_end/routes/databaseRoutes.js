/*** 
 * // Date: 22/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import {emptyPostgreSQL , 
        emptyNeo4j,
        restartNeo4j,
        restartPostgreSQL} from '../controllers/emptyDatabaseController.js';


const router = express.Router();


router.get('/emptyPostgreSQL', emptyPostgreSQL)

router.get('/restartPostgreSQL', restartPostgreSQL)

router.get('/emptyNeo4j', emptyNeo4j)

router.get('/restartNeo4j', restartNeo4j)

export default router;