/*** 
 * // Date: 06/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/



import { fetchNuclearFamilyData } from '../services/neo4j-driver.js';
import { formatForSigma,convertToSigmaFormat,layerByYearReverse } from '../utils/sigmaFormatter.js';


export const getNuclearFamily = async (req, res) => {
  try {
    let nodeIDs = req.body.nodeID || req.body;
    if (!nodeIDs) {
      return res.status(400).json({ error: 'Missing nodeID(s) in request body' });
    }
    if (!Array.isArray(nodeIDs)) {
      nodeIDs = [nodeIDs];
    }

    // Fetch raw data from Neo4j
    const rawData = await fetchNuclearFamilyData(nodeIDs);

    // Format raw data to Sigma.js format
    const sigmaData = await formatForSigma(rawData);

    let plotData = layerByYearReverse(sigmaData);
    plotData = convertToSigmaFormat(plotData);
    
    res.json(plotData);
  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to get nuclear family data' });
  }
};
