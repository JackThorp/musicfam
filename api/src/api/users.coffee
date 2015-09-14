# Users API
# RESTful (attempt) API for User resource
Promise   = require 'bluebird'
_         = require 'lodash'

User  = require('../models').User

validate = (object) ->
  if not (object.username and object.password)
    throw status: 400, message: 'Missing fields'

users =

  browse: (options) ->
    User.find({}).then (users) ->
      _.map users, (user) -> user.read()

  read: (options) ->
    new Promise (resolve, reject) ->
      auth = options.user
      if not auth
        return reject status: 401, message: 'You do not have access rights to this URL'
      
      resolve auth.map()

  add: (object, options) ->
    validate object
    user = new User {username: object.username}
    user.setPassword object.password
    user.save()
    Promise.resolve user.map()


  login: (object, options) ->   
    validate object
    User.findOne(username: object.username).then (user) ->
      if not user then throw
        status: 404, message: 'no such user'
      
      if not user.authenticate object.password then throw
        status: 401, message: 'incorrect password'
      
      user.map()
        

module.exports = users
