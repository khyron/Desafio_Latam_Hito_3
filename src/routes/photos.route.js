const { Router } = require("express");
const { 
    getAllPhotos,
    getPhoto,
    addPhoto,
    updatePhoto,
    deletePhoto
} = require("../models/photos.model");

const photosRouter = Router();

photosRouter.get("/", async (req, res) => {
    try {
        const photos = await getAllPhotos();
        res.status(200).json({ status: "success", payload: photos });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

photosRouter.get("/:id", async (req, res) => {
    try {
        const photo = await getPhoto(req.params.id);
        if (!photo) {
            return res.status(404).json({ status: "error", message: "Photo not found" });
        }
        res.status(200).json({ status: "success", payload: photo });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

photosRouter.post("/", async (req, res) => {
    try {
        const newPhoto = await addPhoto(req.body);
        res.status(201).json({ status: "success", payload: newPhoto });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

photosRouter.put("/:id", async (req, res) => {
    try {
        const updatedPhoto = await updatePhoto(req.params.id, req.body);
        if (!updatedPhoto) {
            return res.status(404).json({ status: "error", message: "Photo not found" });
        }
        res.status(200).json({ status: "success", payload: updatedPhoto });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

photosRouter.delete("/:id", async (req, res) => {
    try {
        const deletedPhoto = await deletePhoto(req.params.id);
        if (!deletedPhoto) {
            return res.status(404).json({ status: "error", message: "Photo not found" });
        }
        res.status(200).json({ status: "success", payload: deletedPhoto });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

module.exports = { photosRouter };