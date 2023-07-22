const aliasTopPlaces = (req, res, next) => {
  if (req?.user) {
    req.query.limit = '5';
    req.query.sort = '-rating.average,charges.price';
    req.query.fields =
      'name rating.average rating.count charges.price summary difficulty';
  }

  next();
};

module.exports = {
  aliasTopPlaces,
};
