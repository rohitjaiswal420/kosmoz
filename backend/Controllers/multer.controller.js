import multer from "multer";

const storage=multer.diskStorage({

    destination:(req,file,cb)=>{
        
        cb(null,'../backend/filefolder');
    },
    filename:(req,file,cb)=>{
         
        cb(null,file.originalname);
    }

    
})

export const upload=multer({storage});

export const uploadFile=(req,res)=>{

    console.log(req.body,req.file);
    
    if(!req.file)
    {
        return res.json({status:false,message:"file not uploaded"});
    }

    res.json({status:false,message:"file uploaded successfully"});
}