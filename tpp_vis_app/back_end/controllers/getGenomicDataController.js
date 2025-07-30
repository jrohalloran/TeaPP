
/*** 
 * // Date: 15/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/



import db from '../services/postgres_db.js';

let data;

async function getPostgresEntries(){
    console.log("Getting all data from genomicData Table")
    try {
        const query = `
            SELECT * FROM genomicData`;
        const result = await db.query(query);
        data = result.rows;
        console.log(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching plants');
    }
}



export const getGenomicData= async (req, res) => {
    try {
        await getPostgresEntries();


        res.json(data);
    } catch (error) {
        console.error('Error fetchingDB Status:', error);
        res.status(500).json({ error: 'Failed to retrieve DB Status' });
    }

}