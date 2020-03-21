const express = require("express");
const {
  getAllAnimals,
  getSingleAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  uploadImage
} = require("../controllers/animal");

const router = express.Router();
const { protect, authorize } = require("../middlewares/auth");

router
  .route("/")
  .get(getAllAnimals)
  .post(protect, authorize("admin"), createAnimal);

router
  .route("/:id")
  .get(protect, authorize("admin"), getSingleAnimal)
  .put(protect, authorize("admin"), updateAnimal)
  .delete(protect, authorize("admin"), deleteAnimal)

router.put("/:id/photo",protect, authorize("admin"), uploadImage);

module.exports = router;
