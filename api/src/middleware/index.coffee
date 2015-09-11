errorHandler = (err, req, res, next) ->
  
  if err.name == 'ValidationError'
 		err.status = 403
 		err.message= err?.errors

  res.status err?.status || 500
  res.json message: err?.message || 'sorry!'

loggedIn = (req, res, next) ->
  if not req.user
    return next(status: 401, message: 'You must be logged in to perform this action')
  next()

module.exports =
  errorHandler: errorHandler
  loggedIn: loggedIn