
/*** 
 * // Date: 02/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import db from '../services/login_db.service.js';




async function performCheck(username){  
    let loginFlag;

    console.log("Performing checks.")
    console.log("Starting DB query")

    console.log("Entered Username: "+username);

    try {
        const result = await db.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
        );
        if (result.rows.length > 0) {
            loginFlag = true;
        } else {
            loginFlag = false;
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching plants');
    }
    return loginFlag;

}





async function insertUser(username,password,email){  
    let loginFlag;

    console.log("Performing checks.")
    console.log("Starting DB query")

    console.log("Entered Username: "+username);
    console.log("Entered Password; "+password);
    console.log("Entered Email; "+email);

    try {
        const result = await db.query(
        'INSERT INTO users (username,password,email) VALUES ($1,$2,$3)',
        [username, password, email]
        );
        console.log("Data inserted in users successfully");
        loginFlag = true;
    } catch (error) {
        console.error(error);
        res.status(500).send('Error Inserting new user');
        loginFlag = false;
    }
    return loginFlag;

}


export const setUserDetails= async (req, res) => {

    console.log("Checking User Details......");
    const userName = req.body[0];
    const userPassword = req.body[1];
    const userEmail = req.body[2];

    try {
        const result = await performCheck(userName);
        console.log(result)
        if (result == false){
            //const result = await insertUser(userName, userPassword, userEmail);
            res.json(true);
        }
        else{
            res.json("Creating New User was unsuccessful");

        }
        //console.log(result);
        //res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.json(false);
    }
}