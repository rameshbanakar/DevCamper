const errorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const geocoder = require("../utils/geocoder");
const path = require("path");
const asyncHandler = require("../middleware/async");
const user = require("../models/user");
//@desc get all bootcamps
//@route /api/v1/bootcamps
//@access public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  //console.log(req.query)
  const reqQuery = { ...req.query };
  const removeField = ["select", "sort", "page", "limit"];
  removeField.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // console.log(queryStr)
  // console.log(JSON.parse(queryStr));
  var query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");
  if (req.query.select) {
    const field = req.query.select.split(",").join(" ");
    var query = query.select(field);
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    var query = query.sort(sortBy);
  } else {
    var query = query.sort("-createdAt");
  }
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  query = query.skip(startIndex).limit(limit);
  const bootcamps = await query;

  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.pre = {
      page: page - 1,
      limit,
    };
  }
  res.status(200).json({ success: true, pagination, data: bootcamps });
});

// @desc get one bootcamps
//@route /api/v1/bootcamps
//@access public
exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse(`bootcamp not found with the id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc create one bootcamps
//@route post /api/v1/bootcamps
//@access private
exports.postBootCamp = asyncHandler(async (req, res, next) => {
  //add user to req.body
  req.body.user = req.user.id;
  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new errorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }
  const bootcamp = await Bootcamp.create(req.body);
  if (!bootcamp) {
    return next(
      new errorResponse(`bootcamp not found with the id ${req.params.id}`, 404)
    );
  }
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc update one bootcamps
//@route put /api/v1/bootcamps
//@access private
exports.putBootCamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if(!bootcamp){
     return next(
       new errorResponse(`bootcamp not found with the id ${req.params.id}`, 404)
     );
  }

  if(bootcamp.user.toString()!==req.user.id && req.user.role!=="admin"){
       return next(
         new errorResponse(
           `your are not authorized to update this bootcamp`,
           401
         )
       );
  }
  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ sucess: true, data: bootcamp });
});

// @desc delete one bootcamps
//@route delete /api/v1/bootcamps
//@access private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse(`bootcamp not found with the id ${req.params.id}`, 404)
    );
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorResponse(`your are not authorized to delete this bootcamp`, 401)
    );
  }
  bootcamp.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc get bootcamps within radius
//@route get /api/v1/bootcamps/:zipcode/:distance
//@access private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  //get lat and lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //calc radius using radians
  //divide dist by radius of earth
  //earth radius=3,963mi / 6378 km

  const radius = distance / 3963;

  const bootcamp = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamp.length,
    data: bootcamp,
  });
});

// @desc upload photo for bootcamps
//@route post /api/v1/bootcamps/:id/photo
//@access private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse(`bootcamp not found with the id ${req.params.id}`, 404)
    );
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorResponse(`your are not authorized to update this bootcamp`, 401)
    );
  }
  if (!req.files) {
    return next(new errorResponse(`please upload a file`, 400));
  }
  //console.log(req.files.file)
  const file = req.files.file;
  //make sure uploaded file is photo
  if (!file.mimetype.startsWith("image")) {
    return next(new errorResponse(`please upload a image file`, 400));
  }
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new errorResponse(`file size is more then specified size`, 400)
    );
  }
  file.name = `photo_${bootcamp._id} ${path.parse(file.name).ext}`;
  //console.log(file.name)

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new errorResponse(`problem with file upload`, 400));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
});
