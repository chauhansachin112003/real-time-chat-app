import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" }); 
    }

    const verifyToken = await jwt.verify(token, process.env.SECRET_KEY);
    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" }); 
  }
};

export default isAuth;
