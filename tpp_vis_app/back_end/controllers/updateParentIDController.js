/*** 
 * // Date: 25/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);




function compareEntries(list, CleanData){


    const matchesData = CleanData.filter(item1 =>
        list.some(item2 => item2.correct_ID === item1.correct_ID)
        );

    //console.log("Matches Data entries Found: ");
    //console.log(matchesData);

    const matchesList = list.filter(item1 =>
        CleanData.some(item2 => item2.correct_ID === item1.correct_ID)
        );

    return [matchesData, matchesList];

}

function findMismatches(data, idKey = 'ID', correctKey = 'correct_ID') {
  const mismatches = [];

  data.forEach(item => {
    if (item[idKey] !== item[correctKey]) {
      mismatches.push({ ...item }); // Copy the item as it was
      item[correctKey] = item[idKey]; // Fix it
    }
  });

  return mismatches;
}

function removeEntries(list, matches, key) {
  if (!Array.isArray(matches)) {
    console.error("Expected 'matches' to be an array but got:", typeof matches, matches);
    return { filtered: list, stats: { removed: 0, retained: list.length } };
  }

  const matchValues = matches.map(item => item[key]);
  const matchSet = new Set(matchValues);

  const filtered = list.filter(item => !matchSet.has(item[key]));

  const stats = {
    removed: list.length - filtered.length,
    retained: filtered.length
  };

  return [filtered, stats];
}


// Replacing Parental Records with updated one 

function updateCorrectIDs(cleanData, matchesList) {

  const matchMap = new Map(matchesList.map(match => [match.ID, match.correct_ID]));
  cleanData.forEach(item => {
    if (matchMap.has(item.correct_male)) {
        //console.log(item.correct_male);
        //console.log(matchMap.get(item.correct_male))
        item.correct_male = matchMap.get(item.correct_male);
    }
    if (matchMap.has(item.correct_female)) {
        //console.log(item.correct_female);
        item.correct_female = matchMap.get(item.correct_female);
        //console.log(matchMap.get(item.correct_female))
    }
  });

  //return cleanData; // Optional, since objects are mutated in place
}



export const updateParents= async (req, res) => {

    const userList = req.body[0];
    const cleanData = req.body[1];

    console.log("User Update List");
    //console.log(userList);

    console.log("CleanData");
    //console.log(cleanData)

    const matches = compareEntries(userList, cleanData);
    const matchesData = matches[0];
    const matchesList = matches[1];

    updateCorrectIDs(cleanData, matchesList)

    const result = removeEntries(userList, matchesList, "correct_ID");
    console.log(result);
    const filtered = result[0];
    const stats = result[1];

    const mismatches = findMismatches(filtered,'ID', 'correct_ID')

    console.log("Mismatches Identified");
    console.log(mismatches);
    //console.log(filtered);
    //console.log(req.body);

    res.json([filtered, stats, mismatches, cleanData]);
    

}
