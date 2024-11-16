import { con } from "../index.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import uap from 'ua-parser-js'

export const formdata = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.json({ status: false });
    }

    con.query(`SELECT api_key from user_table WHERE email='${email}'`, async (err, result) => {

        if (err) {
            return res.json({ status: false });
        }


        const isvaliduser = await bcrypt.compare(req.headers['api_key'] + email.trim(), result[0].api_key);
        if (!isvaliduser) {
            return res.json({ status: false, message: "unauthorized user" });
        }

        const query = `SELECT * FROM formtable`
        con.query(query, (err, result) => {

            if (err) throw err;
            res.json({ status: true, list: result });

        })

    })






}

export const passwordupdate = (req, res) => {

    const { newpassword, email } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newpassword, salt);
    const query = `UPDATE user_table SET password='${hash}' WHERE email='${email}'`
    con.query(query, (err, result) => {

        if (err) throw err;
        if (result.affectedRows === 0) {
            res.status(200).send("not found");
        }
        else {

            con.query(`UPDATE user_table SET UpdatedBy='admin' WHERE email='${email}'`, (err) => {

                if (err) throw err;

            })

            res.status(200).send("success");

        }

    })


}

export const loginUsingjwt = (req, res) => {

    const { email, password, username, ip } = req.body;


    const details = uap(req.headers['user-agent'])
    const query = `SELECT * FROM user_table WHERE email='${email}' and username='${username}'`
    con.query(query, async (err, result) => {

        if (err) throw err;

        if (result.length === 0) {
            res.status(200).send("user not found")
        }
        else {

            const ispassword = await bcrypt.compare(password, result[0].password);

            if (ispassword === false) {
                res.status(200).send("password is wrong")
            }
            else {



                const isvaliduser = await bcrypt.compare(req.headers.api_key + email.trim(), result[0].api_key);


                if (!isvaliduser) {
                    return res.json({ status: false, message: "unauthorized user" });
                }

                con.query(`INSERT INTO log_table VALUES(NULL,'${username}','${email}','${details.browser.name}','${ip}',current_timestamp(),'','1') ON DUPLICATE KEY UPDATE Browser='${details.browser.name}', IpAddress='${ip}', LoginTime=current_timestamp(),logged='1' `, (err) => {

                    if (err) throw err;
                })


                con.query(`CREATE EVENT event_${result[0].id} ON SCHEDULE AT current_timestamp()+INTERVAL 1 HOUR DO UPDATE log_table SET LogoutTime=current_timestamp(),logged='0' WHERE email='${email}' `, (err) => {

                    if (err) throw err;
                })

                const token = jwt.sign({ type: result[0].usertype, id: result[0].id, email: result[0].email, name: result[0].username }, process.env.KEY, { expiresIn: '1h' });
                res.cookie('token', token, { httpOnly: true, maxAge: 3600000, Domain: 'localhost' }).status(200);
                return res.json({ status: true, message: "success" });


            }

        }



    })

}

export const jwtverify = (req, res) => {

    const token = req.cookies.token;

    try {

        if (!token) {

            res.json({ status: false, message: "token not found" });
        }
        else {

            const verify = jwt.verify(token, process.env.KEY);


            if (verify) {


                const query = `SELECT role from role_table WHERE usertype='${verify.type}'`
                con.query(query, (err, result) => {

                    if (err) throw err

                    con.query(`SELECT items FROM menu_table WHERE usertype IN (${result[0].role.substr(1, result[0].role.length - 2)})`, (err, result) => {

                        if (err) throw err
                        res.json({ status: true, response: result, message: "verified", usertype: verify.type, email: verify.email, name: verify.name })


                    })
                })

                // const query = `SELECT menu_table.items,user_table.usertype,user_table.username,user_table.email FROM menu_table INNER JOIN user_table ON menu_table.usertype=user_table.usertype WHERE menu_table.usertype IN ('SEO','operator') and user_table.email='${verify.email}'`

                // con.query(query, (err, result) => {

                //     if (err) {

                //         return res.json({ status: false, message: "some error occured!" })
                //     }

                //     console.log(result);
                //     res.json({ status: true, response: result, message: "verified" })
                // })

            }
            else {

                res.json({ status: false, message: "access denied" });
            }

        }


    } catch (error) {

        console.log(error)
    }


}

export const getUserData = (req, res) => {

    const { email,api_key } = req.query;
    const query = `SELECT * FROM user_table WHERE email='${email}'`
    con.query(query, async (err, result) => {

        if (err) throw err;
        const isValidUser = await bcrypt.compare(api_key + email.trim(), result[0].api_key);
        if (!isValidUser) {
            return res.json({ status: false, message: 'unauthorized user' })
        }

        con.query(`SELECT * FROM role_table`, (err, result) => {

            if (err) throw err;
            res.json({ status: true, response: result })
        })

    })



}



