import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    req.currentUser = await User.findById(req.user.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
}
