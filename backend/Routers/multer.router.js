import { Router } from "express";
import { upload, uploadFile } from "../Controllers/multer.controller.js";
export const multerRouter=Router();

multerRouter.route('/upload').post(uploadFile);