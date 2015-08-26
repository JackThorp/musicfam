
errorHandler = (err, req, res, next) ->
  res.status err?.status || 500
  res.json message: err?.message || 'sorry!'

module.exports =
  errorHandler: errorHandler
