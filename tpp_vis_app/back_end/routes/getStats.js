/*** 
 * // Date: 28/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import express from 'express';
import { getNeo4jStats } from '../controllers/getNeo4jStatsController.js';
import { getPostgresStats } from '../controllers/getPostgresStatsController.js';
import { getStatistics } from '../controllers/getStatisticsController.js';
import { getDBStatus } from '../controllers/getDBStatusController.js';

const router = express.Router();

router.get('/getNeo4jStats', getNeo4jStats);

router.get('/getPostgresStats', getPostgresStats);

router.get('/getStats',getStatistics)

router.get('/getDBStatus',getDBStatus)


export default router;