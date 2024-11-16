import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mysql from 'mysql'
import { contactrouter } from './Routers/contact.router.js';
import { loginrouter } from './Routers/login.router.js';
import { adminrouter } from './Routers/admin.router.js';
import cookieParser from 'cookie-parser';
import { multerRouter } from './Routers/multer.router.js';
//import { upload } from './Controllers/multer.controller.js';
import helmet from 'helmet'
import multer from "multer";
import { upload } from './Controllers/multer.controller.js';

dotenv.config();
const app=express();
const port=process.env.PORT;


// database connection


    export const con=mysql.createConnection({

    host:'localhost',
    user:'root',
    password:'',
    port:3308,
    database:'formdata'
    
    
})

con.connect((err)=>{

    if(err) throw err;
    console.log("database connected successfully");
}) 






// middlewares

app.use(helmet());
app.use(cors({origin:["http://localhost:3000"],credentials:true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.use('/api',contactrouter);
app.use('/api',loginrouter);
app.use('/api',adminrouter);
app.use('/api',upload.single('file'),multerRouter);





// backend connection 

app.listen(port,()=>{
    
    console.log(`backend connected at ${port}`);
})


