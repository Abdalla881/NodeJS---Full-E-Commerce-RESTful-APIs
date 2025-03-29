/* eslint-disable node/no-unsupported-features/es-syntax */
class ApiFeature {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  Filtration() {
    const queryStringObj = { ...this.queryString };
    const queryExexuted = ["page", "sort", "limit", "fields", "keyword"];
    queryExexuted.forEach((field) => delete queryStringObj[field]);

    let Qstring = JSON.stringify(queryStringObj);
    Qstring = Qstring.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(Qstring));
    return this;
  }

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 2;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.NumOfPage = Math.ceil(countDocuments / limit);

    if (endIndex < countDocuments) {
      pagination.nextPage = page + 1;
    }
    if (skip > 0) {
      pagination.PrevPage = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fieldsBy = this.queryString.fields.split(",").join(" ");

      this.mongooseQuery = this.mongooseQuery.select(fieldsBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-_v");
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword.trim();

      const regexQuery = {
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      };

      this.mongooseQuery = this.mongooseQuery.find(regexQuery);
    }
    return this;
  }
}

module.exports = ApiFeature;
