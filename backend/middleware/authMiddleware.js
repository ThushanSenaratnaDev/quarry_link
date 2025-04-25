import jwt from "jsonwebtoken";

// Always get secret from env
const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret";
console.log("JWT_SECRET:", process.env.JWT_SECRET);//remove this line in production
// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Access Denied! No Token Provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        res.status(401).json({ message: "Invalid or Expired Token" });
    }
};

// Permission check
export const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user || !req.user.permissions.includes(requiredPermission)) {
            return res.status(403).json({ message: "Access Denied! Insufficient Permissions." });
        }
        next();
    };
};