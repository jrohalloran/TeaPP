/*** 
 * // Date: 06/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/



import { fetchPedigreeData } from '../services/neo4j-driver.js';
import { formatForSigma2,convertToSigmaFormat,layerByYearReverse } from '../utils/sigmaFormatter.js';
import { saveJsonToFile } from '../utils/fileWriter.js';


export const getPedigree= async (req, res) => {
  try {
    let nodeIDs = req.body.nodeID || req.body;
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

    // Saving the file to local directory -- for finding optimal layout
    await saveJsonToFile(sigmaData, 'PedigreeGraph.json');

    let plotData = layerByYearReverse(sigmaData);
    plotData = convertToSigmaFormat(plotData);

    await saveJsonToFile(plotData, 'plotData_pedigree.json')

    res.json(plotData);
  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to get nuclear family data' });
  }
};
