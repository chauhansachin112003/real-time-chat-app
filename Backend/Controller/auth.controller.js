import { genToken } from "../Confiq/gentoken.js";
import userModel from "../Model/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { username, email, Password } = req.body;

    // Validation
    if (!username || !email || !Password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (Password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const userchecked = await userModel.findOne({ username });
    if (userchecked) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const emailchecked = await userModel.findOne({ email });
    if (emailchecked) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashpassword = await bcrypt.hash(Password, 10);

    const User = await userModel.create({
      username,
      email,
      Password: hashpassword,
      name: username, // Set name as username by default
    });

    const Token = await genToken(User._id);

    res.cookie("token", Token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax", // Changed from "Strict" to "lax" for better development experience
      secure: false,
    });

    const userResponse = await userModel.findById(User._id).select("-Password");
    return res.status(201).json(userResponse);
  } catch (error) {
    return res.status(500).json({ message: `SignUp Error ${error}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, Password } = req.body;

    if (!email || !Password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const Token = await genToken(user._id);

    res.cookie("token", Token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    const userResponse = await userModel.findById(user._id).select("-Password");
    return res.status(200).json(userResponse);
  } catch (error) {
    return res.status(500).json({ message: `Login Error ${error}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Logout Error ${error}` });
  }
};
