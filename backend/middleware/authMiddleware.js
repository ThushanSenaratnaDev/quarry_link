import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret";

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