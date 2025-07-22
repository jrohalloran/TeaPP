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
    removeIsolatedNodes,
    convertToSigmaFormatDynamic} from '../utils/sigmaFormatter.js';



export const getAllNodesEdges = async (req, res) => {
    console.log("Starting getAllNodesEdges Function");

    const colourFlag = "generation";
  try {

    console.log("Fetching Data");
    // Fetch raw data from Neo4j
    const graphData = await fetchAllNodesEdges();

    //console.log(graphData);


    // REMOVAL OF NODES THAT ARE NOT USED FOR BREEDING
    const filteredData = filterNodesWithoutHigherGenDescendants(graphData)

    const groupedData = groupSiblings(filteredData);

    //console.log(filteredData.nodes[0]);

    const layeredData = allNodeslayerByYearReverse(groupedData);

    const cleanedData = removeIsolatedNodes(layeredData);

    //console.log(layeredData);

    const plotData = convertToSigmaFormatDynamic(cleanedData,colourFlag);

    
    res.json(plotData);

  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to get nuclear family data' });
  }
};