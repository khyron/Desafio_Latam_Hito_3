const express = require("express");
const dotenv = require("dotenv");
const { viewsRouter } = require("./routes/views.route");
const { photosRouter } = require("./routes/photos.route");
const { authRouter } = require("./routes/auth.route");

dotenv.config();

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/photos", photosRouter);  // Changed from beersRouter
app.use("/auth", authRouter);
app.use("/", viewsRouter);

// Export just the app without starting the server
module.exports = app;

// Only start the server if this file is run directly
if (require.main === module) {
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
        console.log(`Macro Photography API running on port ${port}`);
    });
    module.exports = server;
}