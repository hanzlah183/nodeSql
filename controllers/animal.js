const asyncHandler = require("../middlewares/async");
const Animal = require("../models/animal");
const sequelize = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");

// @desc     get all animals
// @route    GET /api/v1/animals
// @access   public
exports.getAllAnimals = asyncHandler(async (req, res, next) => {
  const animal = await Animal.findAll();
  res.status(200).json(animal);
});

// @desc     get single animal by id
// @route    GET /api/v1/animals/:id
// @access   public
exports.getSingleAnimal = asyncHandler(async (req, res, next) => {
  const animal = await Animal.findByPk(req.params.id);
  if (!animal) {
    return next(
      new ErrorResponse(`cant found with with id of ${req.params.id}`, 400)
    );
  }
  res.status(200).json(animal);
});

// @desc     Create new animal
// @route    POST /api/v1/animals
// @access   private
exports.createAnimal = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user.id;

  const { name } = req.body;
  let animal = await Animal.findOne({ where: { name: name } });

  if (animal) {
    return next(new ErrorResponse("animal already exist", 400));
  }
  animal = await Animal.create(req.body);

  res.status(200).json(animal);
});

// @desc     update single animal by id
// @route    PUT /api/v1/animals/:id
// @access   private
exports.updateAnimal = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  let animal = await Animal.findByPk(req.params.id);
  if (!animal) {
    return next(
      new ErrorResponse(
        `cant found animal with with id of ${req.params.id}`,
        400
      )
    );
  }
  animal = await sequelize.query(
    `UPDATE names SET name = '${name}' WHERE id = ${req.params.id}`
  );

  res.status(200).json("Successfully Updated Animal");
});

// @desc     delete single animal by id
// @route    GET /api/v1/animals/:id
// @access   private
exports.deleteAnimal = asyncHandler(async (req, res, next) => {
  let animal = await Animal.findByPk(req.params.id);
  if (!animal) {
    return next(
      new ErrorResponse(`cant found with with id of ${req.params.id}`, 400)
    );
  }
  animal = await Animal.destroy({ where: { id: req.params.id } });
  res.status(200).json("Animal Deleted Animal");
});

// @desc     upload single image by id
// @route    PUT /api/v1/animals/:id/photo
// @access   private
exports.uploadImage = asyncHandler(async (req, res, next) => {
  let animal = await Animal.findByPk(req.params.id);
  if (!animal) {
    return next(
      new ErrorResponse(
        `cant found animal with with id of ${req.params.id}`,
        400
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //moving the file to static folder and saving in databse
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    animal = await sequelize.query(
      `UPDATE names SET image = '${file.name}' WHERE id = ${req.params.id}`
    );

    res.status(200).json("Successfully Upload Animal Photo");
    
  });
});
