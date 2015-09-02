Promise = require 'bluebird'
_     = require 'lodash'
lists = require './lists'
users = require './users'
User  = require('../models').User
jwt   = require 'jsonwebtoken'

# Decodes and inspects the X-Auth-Token header. Returns false if the token
# is non-existant or invalid. Returns object about user and authentication level
# if token is valid.
getAuthentication = (token) ->
  
  new Promise (resolve, reject) ->
    if not token
      return resolve false
  
    jwt.verify token, 'secretKey', (err, decodedToken) ->
    
      if err
        return resolve false
    
      User.findOne(username: decodedToken.username).then (user) ->
        resolve user: user


http = (apiMethod) ->
  
  (req, res, next) ->
    
    # Determine any authentication levels to pass a context to method handlers
    getAuthentication(req.get 'X-Auth-Token').then (auth) ->
      context = authentication: auth

      # Define 2 arguments to be passed into API calls: object & options
      object  = req.body
      options = _.extend {}, req.files, req.query, req.params, context

      # For GET & DELETE req.body should be null so we move options into object
      if req.method == 'GET' || req.method == 'DELETE'
        object = options
        options = {}

      # Execute & return result of handler callback with object & options
      apiMethod(object, options).then((response) ->
        # Send properly formatted http response
        res.json response || {}
      ).then(null, (err) ->
        # Pass to API middleware
        next err
      )

module.exports =  {
  http: http
  lists: lists
  users: users
}
