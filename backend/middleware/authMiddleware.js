import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(403).json({ message: "Access Denied! No Token Provided." });
    }

    try {
       // const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.user = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY); //  Store decoded user data (username, permissions) in `req.user`
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or Expired Token" });
    }
};

// Middleware to check if user has a specific permission
export const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user || !req.user.permissions.includes(requiredPermission)) {
            return res.status(403).json({ message: "Access Denied! Insufficient Permissions." });
        }
        next();
    };
};
  
