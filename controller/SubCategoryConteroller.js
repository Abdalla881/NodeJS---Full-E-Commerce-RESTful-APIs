const SUBCATEGORY = require("../Model/SubCategorymModel");

const factory = require("./HandlerFactory");

//Nisted Route
exports.FilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params) {
    filterObject = { category: req.params.categoryId };
    req.filterObject = filterObject;
    next();
  }
};

exports.setCtegoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
    next();
  }
  next();
};

// #desc Get All Subcategory
// #route Get /api/v1/Subcategory
// #Access  Public
exports.GetSubCategoryies = factory.GetAll(SUBCATEGORY);

// #desc Get Specific Subcategory by id
// #route Get /api/v1/Subcategory/id:
// #Access  Public
exports.GetSubCategory = factory.GetOne(SUBCATEGORY);

// #desc create Subcategory
// #route Post /api/v1/Subcategory
// #Access  privet/('admin','manger')
exports.CreatSubCategory = factory.createOne(SUBCATEGORY);

// #desc Update Specific category
// #route PUT /api/v1/Subcategory/:id
// #Access  privet/('admin','manger')
exports.UpdateSubCategory = factory.updateOne(SUBCATEGORY);

// #desc Delete Specific Subcategory
// #route DELETE /api/v1/category/:id
// #Access  privet/('admin','manger')

exports.deleteSubCategory = factory.deleteOne(SUBCATEGORY);
