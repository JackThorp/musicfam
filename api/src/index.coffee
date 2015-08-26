express     = require 'express'
bodyParser  = require 'body-parser'
routes      = require './routes'
conf        = require './config'
middleware  = require './middleware'

# - - APP - - 
app = express()
app.use bodyParser.json()

# Cross Origin Headers
app.use (req, res, next) ->
  res.header 'Access-Control-Allow-Origin', '*'
  res.header 'Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS'
  res.header 'Access-Control-Allow-Headers', 'X-Auth-Token, Content-Type'
  next()

# - - ROUTES - - 
# Calling with no middleware currently
app.use '/api', routes.api
app.use middleware.errorHandler

module.exports = app
