if (alreadySubmited) {
throw new CustomError.BadRequestError('Already Submit for this products')
}
ReviewSchema.index({ product: 1, user: 1 }, { unique: true })
if (err.code && err.code === 11000) {
customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
customError.statusCode = 400;
}
