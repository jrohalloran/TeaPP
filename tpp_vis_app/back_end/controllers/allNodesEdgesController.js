/*** 
 * // Date: 06/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/



import { fetchAllNodesEdges } from '../services/neo4j-driver.js';
import {
    allNodeslayerByYearReverse,
    groupSiblings,
    filterNodesWithoutHigherGenDescendants,
    removeIsolatedNodes,
    convertToSigmaFormatDynamic} from '../utils/sigmaFormatter.js';



export const getAllNodesEdges = async (req, res) => {
    console.log("Starting getAllNodesEdges Function");

    const nodeScale= false;

    const colourFlag = "generation";
  try {

    console.log("Fetching Data");
    // Fetch raw data from Neo4j
    const graphData = await fetchAllNodesEdges();

    //console.log(graphData);


    // REMOVAL OF NODES THAT ARE NOT USED FOR BREEDING
    const filteredData = filterNodesWithoutHigherGenDescendants(graphData)

    const groupedData = groupSiblings(filteredData);


    const layeredData = allNodeslayerByYearReverse(groupedData);

    const cleanedData = removeIsolatedNodes(layeredData);


    const plotData = convertToSigmaFormatDynamic(cleanedData,colourFlag, nodeScale);

    
    res.json(plotData);

  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to get nuclear family data' });
  }
};