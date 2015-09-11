errorHandler = (err, req, res, next) ->
  
  if err.name == 'ValidationError'
 		err.status = 403
 		err.message= err?.errors

  res.status err?.status || 500
  res.json message: err?.message || 'sorry!'

module.exports =
  errorHandler: errorHandler