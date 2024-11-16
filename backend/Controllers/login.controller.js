import { con } from "../index.js";
import bcrypt from 'bcrypt'

export const validate = (req, res) => {

    const { email, password } = req.body;

    try {



        const query = `SELECT * FROM user_table WHERE email='${email}'`

        con.query(query, async (error, result) => {

            if (error) throw error

            if (result.length === 0) {

                res.send("not found");
            }
            else {

                const ispassword = await bcrypt.compare(password, result[0].password);

                if (ispassword === false) {
                    res.status(200).send("password incorrect");
                }
                else {

                    con.query(`UPDATE user_table SET logged='1' WHERE email='${email}'`, (err) => {
                        if (err) throw err;
                    })

                    res.status(200).send({ usertype: result[0].usertype, logged: result[0].logged });

                }

            }



        })

    } catch (error) {
        console.log(error);
    }

}

export const logout = async (req, res) => {

    const { email } = req.body;
    
     
    con.query(`UPDATE log_table SET logged='0' WHERE email='${email}'`, (err) => {

        if (err) throw err;
        res.clearCookie('token', { Domain: 'localhost', Path: '/' });
        return res.json({ status: true, messege: "logout successfully"});

    })

    con.query(`SELECT id FROM user_table WHERE email='${email}'`,(err,result)=>{

        if(err) throw err;
        con.query(`DROP EVENT IF EXISTS event_${result[0].id}`,(err)=>{

            if(err) throw err;
        })
    })
    
   

    con.query(`UPDATE log_table SET LogoutTime=current_timestamp() WHERE email='${email}'`,(err)=>{
        
        if(err) throw err;
    })




}

export const register = async (req, res) => {

    const { username, email, password, usertype} = req.body;
    
    con.query(`SELECT * FROM user_table WHERE email='${email}'`, (err, result) => {

        
        if (err) throw err;
        if (result.length !== 0) {
            return res.json({ status: false, messege: "existed user" });
        }


        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const api_key=bcrypt.hashSync(process.env.api_key+email,salt);
        
        
        const query = `INSERT INTO user_table (id,username,email,password,usertype,CreatedAt,UpdatedBy,CreatedBy,api_key) VALUES(NULL,'${username}','${email}','${hash}','${usertype}',current_timestamp(),'','admin','${api_key}')`;
        con.query(query, (err) => {
            if (err) throw err
            res.json({status:true,messege:"success"});
        })
    })




}