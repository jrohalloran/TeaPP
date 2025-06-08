



import express from 'express';
import { getSelectedPlant} from '../controllers/selectedPlantController.js';

const router = express.Router();


router.post('/getSelectedPlant', getSelectedPlant);


export default router;