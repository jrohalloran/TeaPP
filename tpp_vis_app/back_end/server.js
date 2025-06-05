
/*** 
 * // Date: 05/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

/***
// Function  - Express API SERVER
// Endpoints for the Front-end Angular Post Requests 
***/

// Importing all required functions
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();

// Middleware
app.use(cors()); // To allow cross-origin requests
app.use(bodyParser.json()); // To parse JSON request bodies
app.use(express.text()); // To parse selected ec code from user as string 




app.get('/api/trial', (req, res) => {

  console.log("Trial Successful");
  res.json({ message: 'This is trial data' });
});



  // Defining local host port - 3333
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});