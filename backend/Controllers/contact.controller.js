import { con } from "../index.js";


export const savedetails = async (req, res) => {

    const { name, email, experience, messege } = req.body;
    
    con.query(
        `INSERT INTO formtable VALUES('${name}','${email}','${experience}','${messege}') ON DUPLICATE KEY UPDATE experience='${experience}',messege='${messege}'`, (err, result) => {

            if (err) 
            {
                return res.json({status:false,messege:"error"});
            }

            res.status(200).send("inserted successfully");
        })

      
}



