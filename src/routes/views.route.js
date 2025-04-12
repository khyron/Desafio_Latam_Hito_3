const { Router } = require("express");

const viewsRouter = Router();

viewsRouter.get("/", (req, res) => {
    res.send("Welcome to the Macro Photography API - A database for macro photography enthusiasts!");
});

module.exports = { viewsRouter };