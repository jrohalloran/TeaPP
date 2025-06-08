/*** 
 * // Date: 06/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/



import { fetchAllNodesEdges } from '../services/neo4j-driver.js';
import { convertToSigmaFormat,
    allNodeslayerByYearReverse,
    groupSiblings,
    filterNodesWithoutHigherGenDescendants,
    removeIsolatedNodes} from '../utils/sigmaFormatter.js';
//import { saveJsonToFile } from '../utils/fileWriter.js';


export const getAllNodesEdges = async (req, res) => {
    console.log("Starting getAllNodesEdges Function");
  try {

    console.log("Fetching Data");
    // Fetch raw data from Neo4j
    const graphData = await fetchAllNodesEdges();

    const filteredData = filterNodesWithoutHigherGenDescendants(graphData)

    const groupedData = groupSiblings(filteredData);

    //console.log(filteredData.nodes[0]);

    const layeredData = allNodeslayerByYearReverse(groupedData);

    const cleanedData = removeIsolatedNodes(layeredData);

    const plotData = convertToSigmaFormat(cleanedData);


    res.json(plotData);

  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to get nuclear family data' });
  }
};