# Users API
# RESTful (attempt) API for User resource
Promise   = require 'bluebird'
_         = require 'lodash'

User  = require('../models').User

validate = (object) ->
  if not object.username
    throw status: 400, message: 'Username required.'
  if not object.password
    throw status: 400, message: 'Password required.'

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
    User.findOne(username: object.username).then (user) ->
      if user then throw status:403, message: 'User name already exists'
      
      user = new User {username: object.username}
      user.setPassword object.password
      user.save()
      Promise.resolve user.map()


  login: (object, options) ->   
    validate object
    User.findOne(username: object.username).then (user) ->
      if not user then throw
        status: 404, message: 'Username does not exist.'
      
      if not user.authenticate object.password then throw
        status: 401, message: 'Incorrect password.'
      
      user.map()
        

module.exports = users
