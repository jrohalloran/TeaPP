
/*** 
 * // Date: 02/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/




import db from '../services/login_db.service.js';


async function performCheck(username,password){  
    let loginFlag;

    console.log("Performing checks.")
    console.log("Starting DB query")

    console.log("Entered Username: "+username);
    console.log("Entered Password; "+password);

    try {
        const result = await db.query(
        'SELECT * FROM users WHERE username = $1 AND password = $2',
        [username, password]
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


export const getUserDetails= async (req, res) => {

    console.log("Checking User Details......");
    const userName = req.body[0];
    const userPassword = req.body[1];

    try {

        const result = await performCheck(userName,userPassword);
        console.log(result);
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.json(false);
    }
}