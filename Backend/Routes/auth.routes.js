import express from "express"
import { login, logOut, signUp } from "../Controller/auth.controller.js";

const authRoutes=express.Router()

authRoutes.post("/signUp",signUp)
authRoutes.post("/login",login)
authRoutes.get("/logout",logOut)
export default authRoutes