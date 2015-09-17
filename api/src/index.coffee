express     = require 'express'
bodyParser  = require 'body-parser'
routes      = require './routes'
config      = require './config'
middleware  = require './middleware'

User  = require('./models').User
jwt		= require 'jsonwebtoken'


# - - APP - - 
app = express()
app.use bodyParser.json()

# Cross Origin Headers
app.use (req, res, next) ->
  res.header 'Access-Control-Allow-Origin', '*'
  res.header 'Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS'
  res.header 'Access-Control-Allow-Headers', 'X-Auth-Token, Content-Type'
  next()

# Decodes the X-Auth-Token and attaches any user info to the request object.
app.use (req, res, next) ->
  req.user = false

  token = req.get 'X-Auth-Token'
  if not token then return next()
  jwt.verify token, config.token_secret, (err, decodedToken) ->  

    if err then return next()

    User.findOne(username: decodedToken.username).then (user) ->
      req.user = user
      next()


# - - ROUTES - - 
# Calling with no middleware currently

app.use '/api', routes.api 
app.use middleware.errorHandler


module.exports = app
