const errorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const geocoder=require("../utils/geocoder")
const asyncHandler = require("../middleware/async");
//@desc get all bootcamps
//@route /api/v1/bootcamps
//@access public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  //console.log(req.query)
  let queryStr=JSON.stringify(req.query)
  queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`)
 // console.log(queryStr)
 // console.log(JSON.parse(queryStr));
 let query = JSON.parse(queryStr);
  const bootcamps = await Bootcamp.find(query);
  res.status(200).json({ success: true, data: bootcamps });
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
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ sucess: true, data: bootcamp });
});

// @desc delete one bootcamps
//@route delete /api/v1/bootcamps
//@access private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse(`bootcamp not found with the id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});


// @desc get bootcamps within radius
//@route get /api/v1/bootcamps/:zipcode/:distance
//@access private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const {zipcode,distance}=req.params;
  //get lat and lng from geocoder
  const loc=await geocoder.geocode(zipcode);
  const lat=loc[0].latitude;
  const lng=loc[0].longitude;
  
  //calc radius using radians
  //divide dist by radius of earth
  //earth radius=3,963mi / 6378 km

  const radius=distance/3963

  const bootcamp = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success:true,
    count:bootcamp.length,
    data:bootcamp
  })
});
