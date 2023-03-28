const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Math.round(Math.random() * 1e9)}.jpg`);
  },
});
const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://127.0.0.1/photos", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const photoSchema = new mongoose.Schema({
  filename: String,
  path: String,
  date: { type: Date, default: Date.now },
});

const Photo = mongoose.model("Photo", photoSchema);

app.get("/photos", async (req, res) => {
  const photos = await Photo.find({});
  res.json(photos);
});

app.post("/photos", upload.single("photo"), async (req, res) => {
  const photo = new Photo({
    filename: req.file.filename,
    path: req.file.path,
  });
  await photo.save();
  res.json(photo);
});

app.put("/photos/:id", upload.single("photo"), async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  photo.filename = req.file.filename;
  photo.path = req.file.path;
  await photo.save();
  res.json(photo);
});

app.delete("/photos/:id", async (req, res) => {
  await Photo.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
