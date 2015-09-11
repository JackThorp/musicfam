Promise   = require 'bluebird'
_         = require 'lodash'
playlists = require './playlists'
users = require './users'

http = (apiMethod) ->
  
  (req, res, next) ->

    # Define 2 arguments to be passed into API calls: object & options
    object  = req.body
    options = _.extend {}, req.files, req.query, req.params, {user: req.user}

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
  playlists: playlists
  users: users
}
