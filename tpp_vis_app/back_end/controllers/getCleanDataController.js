
// Jennifer O'Halloran
// 22/06/2025


// Thesis Project 




let userCleanedIDs = [];
let userCleanedParents = [];
let processedData = [];


function updateData(processedData){



}


function removeIDEntries(userCleanedIDs,processedData){


    const toRemoveIds = userCleanedIDs.filter(item => item.removed)
    .map(item => item.ID);
    console.log("Number of Entries removed");
    console.log(toRemoveIds.length);
    console.log(toRemoveIds);

    const updatedData = processedData.filter(item => !toRemoveIds.includes(item.ID));  
    return updatedData;
}

function updateCloneIDs(userCleanedIDs,processedData){
    let changedIDs = []

    userCleanedIDs.forEach(userItem => {
        const original = processedData.find(d => d.ID === userItem.ID);
        if (original && original.correct_ID !== userItem.correct_ID) {
            changedIDs.push({from:original.correct_ID,
                to: userItem.correct_ID});
            original.correct_ID = userItem.correct_ID;

        }
    });
    console.log(changedIDs);


    changedIDs.forEach(update => {
    processedData.forEach(entry => {
        if (entry.correct_female === update.from) {
        console.log(`[Updating Female] ID: ${entry.ID}, From: ${entry.correct_female}, To: ${update.to}`);
        entry.correct_female = update.to;
        //console.log(entry);
        }

        if (entry.correct_male === update.from) {
        console.log(`[Updating Male] ID: ${entry.ID}, From: ${entry.correct_male}, To: ${update.to}`);
        entry.correct_male = update.to;
        //console.log(entry);
        }
        });
    });
    return processedData;

}

function updateParentIDs(userCleanedParents,processedData){
    let changedIDs = []

    userCleanedParents.forEach(userItem => {
        const original = processedData.find(d => d.ID === userItem.ID);
        if (original && original.correct_ID !== userItem.correct_ID) {
            changedIDs.push({from:original.correct_ID,
                to: userItem.correct_ID});
            original.correct_ID = userItem.correct_ID;

        }
    });
    console.log(changedIDs);

    changedIDs.forEach(update => {
    processedData.forEach(entry => {
        if (entry.correct_female === update.from) {
        console.log(`[Updating Female] ID: ${entry.ID}, From: ${entry.correct_female}, To: ${update.to}`);
        entry.correct_female = update.to;
        //console.log(entry);
        }

        if (entry.correct_male === update.from) {
        console.log(`[Updating Male] ID: ${entry.ID}, From: ${entry.correct_male}, To: ${update.to}`);
        entry.correct_male = update.to;
        //console.log(entry);
        }
    });
    });
    return processedData;
}


function insertData(){




}


function main(userCleanedIDs,userCleanedParents,processedData){

    console.log("Main Function Initialised")
    console.log("----- Removing Flagged Clone IDs ------")
    let updatedData = removeIDEntries(userCleanedIDs,processedData);
    updatedData = updateCloneIDs(userCleanedIDs,updatedData);
    updatedData = updateParentIDs(userCleanedParents,updatedData);

    // Update Parents - New clones 
    // Update Parents - New Parents



    //console.log(userCleanedIDs);
    //console.log(userCleanedParents);
    //console.log(processedData);
}


export const getCleanData= async (req, res) => {

    console.log("Starting Comparison Function")

  try{
    userCleanedIDs = req.body[0];
    userCleanedParents = req.body[1];
    processedData = req.body[2];

    console.log("Attempting to compare data...")
    main(userCleanedIDs,userCleanedParents,processedData);
    res.json("Function Working");
    

  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to process data' });
  }
}
