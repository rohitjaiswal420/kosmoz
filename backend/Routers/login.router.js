import { validate } from "../Controllers/login.controller.js";
import { logout } from "../Controllers/login.controller.js";
import { register } from "../Controllers/login.controller.js";
import { Router } from "express";

export const loginrouter=Router();

loginrouter.route('/validate').post(validate);
loginrouter.route('/logout').post(logout);
loginrouter.route('/register').post(register);

