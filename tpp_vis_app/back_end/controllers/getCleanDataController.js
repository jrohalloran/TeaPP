/*** 
 * // Date: 22/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

// Thesis Project 


import { Client } from 'pg';


let userCleanedIDs = [];
let userCleanedParents = [];
let processedData = [];


function removeIDEntries(userCleanedIDs,processedData){

    // Remove ID entries if flagged for removal
    const toRemoveIds = userCleanedIDs.filter(item => item.removed)
    .map(item => item.ID);
    console.log("Number of Entries removed");
    console.log(toRemoveIds.length);
    console.log(toRemoveIds);

    const updatedData = processedData.filter(item => !toRemoveIds.includes(item.ID));  
    return updatedData;
}

function removeParentEntries(userCleanedParents,processedData){

    // Remove parent entries if flagged for removal

    const toRemoveIds = userCleanedParents.filter(item => item.removed)
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

    // Update the parent IDs if clone is used as parent
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


    console.log(userCleanedParents);

    const changedUsers = userCleanedParents.filter(
    user => user.ID !== user.correct_ID);

    // If you want to build a `changedIDs` array with {from, to}
    const changedIDs = changedUsers.map(user => ({
    from: user.ID,
    to: user.correct_ID
    }));

    changedUsers.forEach(user => {
    const original = processedData.find(item => item.ID === user.ID);

    if (original) {
        console.log(`Updating ${original.ID}: ${original.correct_ID} → ${user.correct_ID}`);
        original.correct_ID = user.correct_ID;
    } else {
        console.warn(`No matching entry in processedData for ID ${user.ID}`);
    }
    });


    console.log("Updated Parents")
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

/*
function updateRemovedIDs(userCleanedIDs,processedData){

  userCleanedIDs.forEach(updatedItem => {
    const original = processedData.find(p => p.ID === updatedItem.ID);
    if (original && original.removed !== updatedItem.removed) {
      original.removed = updatedItem.removed;
    }
  });
  return processedData;

}*/


function updateRemovedFlag(cleanedData,processedData){

  console.log("Updating flagged entries")
  const entriesRemoved = [];
  cleanedData.forEach(updatedItem => {
    const original = processedData.find(p => p.ID === updatedItem.ID);
    if (original && original.removed !== updatedItem.removed) {
      console.log(updatedItem.ID);
      entriesRemoved.push(updatedItem.ID);
      //console.log(original.removed);
      //console.log(updatedItem.removed);

      original.removed = updatedItem.removed;
    }
  });

  console.log("Number of entries removed;");
  console.log(entriesRemoved.length)
  return processedData;

}

async function insertData(data) {
  console.log("Starting Insertion Function....");


  const client = new Client({
    user: "jennyohalloran",
    host: "localhost",
    database: "teapp_app_db",
    port: "5432",
  });
  console.log("----- Attempting to connect to PostgreSQL DB-----");
  try {
    await client.connect();
    console.log("-----Connection successful-----");
    
    for (const entry of data) {
      const query = 'INSERT INTO cleanData (clone_id, correct_id, correct_female, correct_male, removed) VALUES ($1, $2, $3, $4, $5)';
      const values = [entry.ID, entry.correct_ID, entry.correct_female, entry.correct_male, entry.removed];
      await client.query(query, values);
        
    }

  } catch (err) {
    console.error('Error inserting data', err);
  }
    finally {
    await client.end();
  }
  console.log("finalData inserted sucessfuly in cleanData Table!")
}


async function main(userCleanedIDs,userCleanedParents,processedData){

    let status = false;

    console.log("Main Function Initialised")
    console.log("----- Removing Flagged Clone IDs ------")
    //let updatedData = removeIDEntries(userCleanedIDs,processedData);
    //updatedData = removeParentEntries(userCleanedParents,processedData);
    let updatedData = updateCloneIDs(userCleanedIDs,processedData);
    updatedData = updateParentIDs(userCleanedParents,updatedData);

    updatedData = updateRemovedFlag(userCleanedIDs,updatedData);
    updatedData = updateRemovedFlag(userCleanedParents,updatedData);

    console.log("Final Data");

    //console.log(updatedData);
    await insertData(updatedData);
    // Update Parents - New clones 
    // Update Parents - New Parents
    status = true;
    return updatedData;
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
    const finalData = await main(userCleanedIDs,userCleanedParents,processedData);

    res.json(finalData);

  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to process data' });
  }
}
