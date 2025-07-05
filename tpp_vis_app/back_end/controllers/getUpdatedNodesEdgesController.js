/*** 
 * // Date: 05/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/


import { fetchAllNodesEdges } from '../services/neo4j-driver.js';
import { convertToSigmaFormat,
    allNodeslayerByYearReverse,
    groupSiblings,
    filterNodesWithoutHigherGenDescendants,
    removeIsolatedNodes,
    layerByGenerationAll,
    layerByGenerationFiltered,
    layerByGeneration,
    allNodeslayerByYearReverseDynamic,
    convertToSigmaFormatDynamic} from '../utils/sigmaFormatter.js';



export const getUpdatedNodesEdges = async (req, res) => {
    console.log("Starting getpdatedNodesEdges Function");


    let filteredData;
    let groupedData;
    let layeredData;
    //let cleanedData;

    const flags = req.body;
    console.log(flags);
    const groupFlag = flags[0];
    console.log(groupFlag);
    const layerFlag = flags[1];
    console.log(layerFlag);
    const filterFlag = flags[2];
    console.log(filterFlag);
    const colourFlag = flags[3];
    //res.json("This pathway works")
    let nodeSpacing;
    let layerHeight;
    let nodeSpacingYear;
    let layerHeightYear;

  try {

    console.log("Fetching Data");
    // Fetch raw data from Neo4j
    const graphData = await fetchAllNodesEdges();

    //console.log(graphData);
    if (filterFlag == 'yes'){    // REMOVAL OF NODES THAT ARE NOT USED FOR BREEDING
        filteredData = filterNodesWithoutHigherGenDescendants(graphData);
        layerHeight = 1000000;
        nodeSpacing = 100000;
        layerHeightYear = 200_000_000;
        nodeSpacingYear = 200_000_000;

        
    }
    if (filterFlag == 'no'){
        filteredData = graphData;
        layerHeight = 100000000;
        nodeSpacing = 2000000;
        layerHeightYear = 200_000_000;
        nodeSpacingYear = 200_000_000;
    }
    if(filterFlag != 'yes' && filterFlag != 'no') {
        console.log("Filtering Flag didn't match criteria");
        console.error('Controller error:', err);
        res.status(500).json({ error: 'Failed to get nuclear family data' });
    }


    // Grouping Function -- Group by siblings 
    if (groupFlag=="sibling"){// REMOVAL OF NODES THAT ARE NOT USED FOR BREEDING
        groupedData = groupSiblings(filteredData);
        if (filterFlag == 'yes'){    // REMOVAL OF NODES THAT ARE NOT USED FOR BREEDING
            layerHeight = 1000000;
            nodeSpacing = 100000;
            layerHeightYear = 200_000_000;
            nodeSpacingYear = 200_000_000;
            }
        if (filterFlag == 'no'){
            layerHeight = 100000000;
            nodeSpacing = 2000000;
            layerHeightYear = 200_000_000;
            nodeSpacingYear = 200_000_000;
        }
    }if (groupFlag=="none"){
        groupedData = filteredData;
        if (filterFlag == 'yes'){ 
            layerHeight = 50000000;
            nodeSpacing = 2000000;
            layerHeightYear = 1_000_000_000;
            nodeSpacingYear = 300_000_000;
            }
        if (filterFlag == 'no'){
            layerHeight = 900000000;
            nodeSpacing = 2000000;
            layerHeightYear = 2_000_000_000;
            nodeSpacingYear = 100_000_000;
        }
    }

    

    if (layerFlag == 'year'){
        //layeredData = allNodeslayerByYearReverse(groupedData);
        layeredData = allNodeslayerByYearReverseDynamic(groupedData,layerHeightYear,nodeSpacingYear);

    }
    if (layerFlag == 'generation'){
        layeredData = layerByGeneration(groupedData, layerHeight, nodeSpacing); 
    }

    if(layerFlag != 'year' && layerFlag != 'generation') {
        console.log("Layering Flag didn't match criteria");
        console.error('Controller error:', err);
        res.status(500).json({ error: 'Failed to get nuclear family data' });
    }

    const cleanedData = removeIsolatedNodes(layeredData);

    const plotData = convertToSigmaFormatDynamic(cleanedData,colourFlag);

    res.json(plotData);

  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to get nuclear family data' });
  }
 
};