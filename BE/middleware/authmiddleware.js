import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    
    // const token = req.cookies.token;
    // const token=localStorage.getItem("token");
   
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify token
    //@ts-ignore
  const decoded = jwt.verify(token, process.env.JWT);
  console.log(decoded);
    // Attach the decoded user data to the request object (optional)
    //@ts-ignore
    req.user =  decoded.id 
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

export default authMiddleware;