/*** 
 * // Date: 08/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import db from '../services/postgres_db.js';


export async function getSelectedPlant(req, res) {
    
    console.log("Starting SelectedPlant Query...");
    console.log("Full request body:", JSON.stringify(req.body, null, 2));

    console.log("Starting getSelectedPlants function for:")
    console.log(req.body);
    const clone_id = req.body; 

    if (!clone_id) {
        return res.status(400).json({ message: 'Missing clone_id in request body.' });
    }

    if (!Array.isArray(clone_id) || clone_id.length === 0) {
        return res.status(400).json({ message: 'Request body must include a non-empty array "clone_id".' });
    }

    try {
        const result = await db.query(
        'SELECT * FROM plants WHERE clone_id = ANY($1)',
        [clone_id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching plant records');
    }
}