import { Router } from "express";
import { savedetails } from "../Controllers/contact.controller.js";
export const contactrouter=Router();

contactrouter.route('/save').post(savedetails);