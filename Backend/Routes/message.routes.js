import express from "express";
import isAuth from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";
import sendmessage, { getMessage } from "../Controller/message.controller.js";

const messageRoutes = express.Router();

messageRoutes.post(
  "/send/:receiver",
  isAuth,
  upload.single("image"),
  sendmessage,
);
messageRoutes.get("/get/:receiver", isAuth, getMessage); // Changed from POST to GET

export default messageRoutes;
