// @desc get all bootcamps
//@route /api/v1/bootcamps
//@access public
exports.getBootCamps = (req, res, next) => {
  res.status(200).json({ id: 1, msg: "show all bootcamps" });
};

// @desc get one bootcamps
//@route /api/v1/bootcamps
//@access public
exports.getBootCamp = (req, res, next) => {
  res.status(200).json({ id: 1, msg: `show bootcamps ${req.params.id}` });
};

// @desc create one bootcamps
//@route post /api/v1/bootcamps
//@access private
exports.postBootCamp = (req, res, next) => {
  res.status(200).json({ id: 1, msg: "create new bootcamps" });
};

// @desc update one bootcamps
//@route put /api/v1/bootcamps
//@access private
exports.putBootCamp = (req, res, next) => {
  res.status(200).json({ id: 1, msg: `update bootcamps ${req.params.id}` });
};

// @desc delete one bootcamps
//@route delete /api/v1/bootcamps
//@access private
exports.deleteBootCamp = (req, res, next) => {
  res.status(200).json({ id: 1, msg: `delete bootcamps ${req.params.id}` });
};
