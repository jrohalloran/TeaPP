/*** 
 * // Date: 10/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import { fetchPartnerOf } from '../services/neo4j-driver.js';


export const getPartnerOf=async(req, res) => {

    console.log("Starting getPartnerOf Function");
  try {
    let nodeIDs = req.body.nodeID || req.body;
    if (!nodeIDs) {
      return res.status(400).json({ error: 'Missing nodeID(s) in request body' });
    }
    if (!Array.isArray(nodeIDs)) {
      nodeIDs = [nodeIDs];
    }
    console.log(nodeIDs);

    console.log("Getting Partners");
    const partners = await fetchPartnerOf(nodeIDs);
    console.log(partners);

    res.json(partners);
  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to get nuclear family data' });
  }
};
