import UploadOnCloudinary from "../Confiq/Cloudinary.js";
import Conversation from "../Model/Conversation.model.js";
import Message from "../Model/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const sendmessage = async (req, res) => {
  try {
    let sender = req.userId;
    let { receiver } = req.params;
    let { message } = req.body;

    let image;
    if (req.file) {
      image = await UploadOnCloudinary(req.file.path);
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    let newMessage = await Message.create({
      sender,
      receiver,
      message,
      image: image || "",
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        message: [newMessage._id],
      });
    } else {
      conversation.message.push(newMessage._id);
      await conversation.save();
    }

    const receiverSocketId=getReceiverSocketId(receiver)
    if(receiverSocketId)
    {
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }
    // Populate the message before sending
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "username name image")
      .populate("receiver", "username name image");

    return res.status(201).json(populatedMessage);
  } catch (error) {
    return res.status(500).json({ message: `send message error ${error}` });
  }
};

export const getMessage = async (req, res) => {
  try {
    let sender = req.userId;
    let { receiver } = req.params;

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate({
      path: "message",
      populate: [
        { path: "sender", select: "username name image" },
        { path: "receiver", select: "username name image" },
      ],
    });

    if (!conversation) {
      return res.status(200).json([]); // Return empty array for new conversations
    }

    return res.status(200).json(conversation.message);
  } catch (error) {
    return res.status(500).json({ message: `get message error ${error}` });
  }
};

export default sendmessage;
