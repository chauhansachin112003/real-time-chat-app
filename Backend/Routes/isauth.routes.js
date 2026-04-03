import express from "express"
import { editProfile, getCurrentUser, getOtherUser } from "../Controller/user.controller.js"
import isAuth from "../middleware/isAuth.js"
import { upload } from "../middleware/multer.js"

const isauthRoutes=express.Router()


isauthRoutes.get("/current",isAuth,getCurrentUser)
isauthRoutes.get("/others",isAuth,getOtherUser)
isauthRoutes.post("/upload",isAuth,upload.single("image"),editProfile)

export default isauthRoutes