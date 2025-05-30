const jwt = require('jsonwebtoken');
// middleware to authenticate JWT tokens
const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. Invalid token format." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log(req.user.id);
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token." });
    }
};

module.exports = auth;
