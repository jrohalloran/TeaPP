/*** 
 * // Date: 06/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/



import { fetchPedigreeData } from '../services/neo4j-driver.js';
import { formatForSigma2,convertToSigmaFormat,layerByYearBoundedSpacing } from '../utils/sigmaFormatter.js';

export const getPedigree= async (req, res) => {


  try {
    let nodeIDs = req.body.nodeID || req.body[0];
    let colourFlag = req.body[1] || "generation";
    console.log(colourFlag);
    console.log(nodeIDs);
    if (!nodeIDs) {
      return res.status(400).json({ error: 'Missing nodeID(s) in request body' });
    }
    if (!Array.isArray(nodeIDs)) {
      nodeIDs = [nodeIDs];
    }

    // Fetch raw data from Neo4j
    const rawData = await fetchPedigreeData(nodeIDs);

    // Format raw data to Sigma.js format
    const sigmaData = await formatForSigma2(rawData);
    //console.log(sigmaData);
    

    let plotData = layerByYearBoundedSpacing(sigmaData);
    console.log(colourFlag);
    plotData = convertToSigmaFormat(plotData);


    res.json(plotData);
  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to get nuclear family data' });
  }
};
