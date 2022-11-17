const errorResponse = require("../utils/errorResponse");
const Courses = require("../models/Course");
const asyncHandler = require("../middleware/async");
const bootcamp = require("../models/Bootcamp");
const Bootcamp = require("../models/Bootcamp");
//@desc get all courses
//@route /api/v1/bootcamp/:bootcampsId/courses
//@access public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Courses.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Courses.find();
  }
  const courses = await query;
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

//@desc get single courses
//@route /api/v1/courses/:id
//@access public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.find({ _id: req.params.id });
  if (!course) {
    return next(
      new errorResponse(`no courses with the id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,

    data: course,
  });
});

//@desc add  courses
//@route POST /api/v1/bootcamp/:bootcampsId/courses
//@access private

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user=req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new errorResponse(`no bootcamp with the id ${req.params.bootcampId}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorResponse(`your are not authorized to add a course to this bootcamp`, 401)
    );
  }

  const course = await Courses.create(req.body);
  res.status(200).json({
    success: true,

    data: course,
  });
});

//@desc update  courses
//@route put /api/v1/courses/:id
//@access private

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const courses = await Courses.findById(req.params.id);
  if (!courses) {
    return next(
      new errorResponse(`no course with the id ${req.params.id}`, 404)
    );
  }

  if (courses.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorResponse(
        `your are not authorized to update a this course`,
        401
      )
    );
  }
  const course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,

    data: course,
  });
});

//@desc dalete  courses
//@route put /api/v1/courses/:id
//@access private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const courses = await Courses.findById(req.params.id);
  if (!courses) {
    return next(
      new errorResponse(`no course with the id ${req.params.id}`, 404)
    );
  }
  const course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (courses.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorResponse(`your are not authorized to delete  this course`, 401)
    );
  }

  await courses.remove()
  res.status(200).json({
    success: true,

    data: {},
  });
});
