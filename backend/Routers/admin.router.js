import { formdata } from "../Controllers/admin.controller.js";
import { passwordupdate } from "../Controllers/admin.controller.js";
import { loginUsingjwt } from "../Controllers/admin.controller.js";
import { jwtverify } from "../Controllers/admin.controller.js";
import { getUserData } from "../Controllers/admin.controller.js";

import { Router } from "express";

export const adminrouter=Router();

adminrouter.route('/getusers').post(formdata);
adminrouter.route('/updatepass').post(passwordupdate);
adminrouter.route('/loginUsingjwt').post(loginUsingjwt);
adminrouter.route('/jwtverify').get(jwtverify);
adminrouter.route('/getuserdata').get(getUserData);

