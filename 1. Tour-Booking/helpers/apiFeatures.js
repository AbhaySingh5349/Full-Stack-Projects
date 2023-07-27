class APIFeatures {
  constructor(model, routeQuery) {
    this.model = model;
    this.routeQuery = routeQuery;

    // FILTERING
    const queryObj = { ...this.routeQuery };
    console.log('queryObj: ', queryObj);

    const excludedQueries = ['page', 'sort', 'limit', 'fields'];
    excludedQueries.forEach((key) => delete queryObj[key]);

    // ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // appending advanced queries with $
    console.log('advancedQueryObj: ', JSON.parse(queryStr));

    this.query = this.model.find(JSON.parse(queryStr));
  }

  sort() {
    if (this.routeQuery.hasOwnProperty('sort')) {
      const sortBy = this.routeQuery.sort.split(',').join(' '); // if instead of ',' we pass '+' in query, then no need of join(' ')
      this.query.sort(sortBy);
    } else {
      this.query.sort('duration');
    }

    return this;
  }

  limitFields() {
    if (this.routeQuery.hasOwnProperty('fields')) {
      this.query.select(this.routeQuery.fields); // if query passed like: http://localhost:3000/tours?fields=name+duration+difficulty+price
    } else {
      this.query.select('-__v -createdAt'); // excluding 'id' & '__v' keys
    }

    return this;
  }

  paginate() {
    const page = (this.routeQuery?.page ?? 1) * 1;
    const limit = (this.routeQuery?.limit ?? 10) * 1;
    const skip = (page - 1) * limit;

    console.log('page: ', page, ' , limit: ', limit);

    this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = {
  APIFeatures,
};
