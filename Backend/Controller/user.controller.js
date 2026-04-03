import UploadOnCloudinary from "../Confiq/Cloudinary.js";
import userModel from "../Model/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    let userId = req.userId;
    let user = await userModel.findById(userId).select("-Password"); // Changed from "-password" to "-Password" (matches your schema)
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `current user error ${error}` });
  }
};

export const editProfile = async (req, res) => {
  try {
    let { name } = req.body;
    let image;
    if (req.file) {
      image = await UploadOnCloudinary(req.file.path);
    }

    let updateData = {};
    if (name) updateData.name = name;
    if (image) updateData.image = image;

    let user = await userModel
      .findByIdAndUpdate(req.userId, updateData, { new: true })
      .select("-Password");

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `profile error ${error}` });
  }
};

export const getOtherUser = async (req, res) => {
  try {
    let users = await userModel
      .find({
        _id: { $ne: req.userId },
      })
      .select("-Password"); // Changed from "-password" to "-Password"
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: `other user error ${error}` });
  }
};
