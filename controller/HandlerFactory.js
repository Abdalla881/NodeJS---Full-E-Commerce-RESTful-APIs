const asyncHandler = require("express-async-handler");

const AppError = require("../utils/AppError");
const ApiFeature = require("../utils/ApiFeature");

exports.deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findOneAndDelete({ _id: id });
    if (!document) {
      return next(new AppError(`Not document for this id ${id}`, 404));
    }

    if (model.modelName === "Review") {
      await model.calcAvgRatingAndQuantity(document.product);
    }
    res.status(204).send();
  });

exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await model.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!document) {
      return next(new AppError(`Not document for this id ${id}`, 404));
    }

    //Trigger 'save' event when save Document
    document.save();
    res.status(200).json({ document });
  });

exports.createOne = (model) =>
  asyncHandler(async (req, res) => {
    const newDocument = await model.create(req.body);
    res.status(201).json({ data: newDocument });
  });

exports.GetOne = (model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const query = model.findById(id);
    if (populateOpt) {
      query.populate(populateOpt);
    }
    const document = await query;
    if (!document) {
      return next(new AppError(`Not document for this id ${id}`, 404));
    }
    res.status(200).json({ document });
  });

exports.GetAll = (model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }
    const countDocuments = await model.countDocuments();
    const apifeature = new ApiFeature(model.find(filter), req.query)
      .limitFields()
      .sorting()
      .search()
      .Filtration()
      .paginate(countDocuments);

    const { mongooseQuery, paginationResult } = apifeature;
    const doucuments = await mongooseQuery;

    res.status(200).json({
      result: doucuments.length,
      paginationResult,
      data: doucuments,
    });
  });
