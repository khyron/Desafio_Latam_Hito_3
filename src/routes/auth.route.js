const { Router } = require("express");
const jwt = require("jsonwebtoken");

const authRouter = Router();

authRouter.post("/register", (req, res) => {
    const { username } = req.body;
    res.send(generateToken(username));
});

const generateToken = (username) => {
    const jwtSecret = process.env.JWT_SECRET || "secret";
    return jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });
};

module.exports = { authRouter };
