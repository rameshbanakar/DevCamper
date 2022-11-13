const Bootcamp = require("../models/Bootcamp");
//@desc get all bootcamps
//@route /api/v1/bootcamps
//@access public
exports.getBootCamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, data: bootcamps });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc get one bootcamps
//@route /api/v1/bootcamps
//@access public
exports.getBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    //res.status(400).json({ success: false });
    next(error)
  }
};

//@desc create one bootcamps
//@route post /api/v1/bootcamps
//@access private
exports.postBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    if(!bootcamp){
      res.status(400).json({sucess:false})
    }
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc update one bootcamps
//@route put /api/v1/bootcamps
//@access private
exports.putBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({sucess:true,data:bootcamp})
  } catch (error) {
    res.status(400).json({ success: false });
  }
  
};

// @desc delete one bootcamps
//@route delete /api/v1/bootcamps
//@access private
exports.deleteBootCamp = async (req, res, next) => {
  try {
    const bootcamp=await Bootcamp.findByIdAndDelete(req.params.id)
    res.status(200).json({success:true,data:{}})
  } catch (error) {
    res.status(400).json({success:false})
  }
};
