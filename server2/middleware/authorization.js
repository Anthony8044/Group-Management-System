const jwt = require("jsonwebtoken");
require("dotenv").config();

//this middleware will on continue on if the token is inside the local storage

module.exports = function (req, res, next) {
    try {
        // Get token from header
        const token = req.header("token");

        // Check if not token
        if (!token) {
            return res.status(403).json({ msg: "authorization denied" });
        }

        // Verify token
        //it is going to give use the user id (user:{id: user.id})
        const payload = jwt.verify(token, process.env.jwtSecret);
        req.user = payload;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};