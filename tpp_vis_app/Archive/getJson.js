// Jennifer O'Halloran
// 05/06/2025


// Reading in Json 

// Trial Back-end Processing script 


//const fs = require('fs');
const path = require('path');




export function getFile(){
    console.log("Getting JSON file");
    const inputFilePath = path.resolve(__dirname, 'plant_clone_sigma_size_by_children_gencol.json');


    let json; 

    fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) return console.error('Failed to read input file:', err);

    try {
        json = JSON.parse(data);
        console.log(json);

    } catch (e) {
        console.error('Processing error:', e.message);
    }
    });
    return json;
}

//getFile();

module.exports = {
    getFile
  };