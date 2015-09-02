# Users API
# RESTful (attempt) API for User resource
Promise   = require 'bluebird'

User  = require('../models').User

validate = (object) ->
  if not (object.username and object.password)
    throw status: 400, message: 'Missing fields'

users =

  add: (object, options) ->
    
    new Promise (resolve, reject) ->
      validate object
      user = new User {username: object.username}
      user.setPassword object.password
      user.save()
      resolve user.map()

  read: (options) ->
    new Promise (resolve, reject) ->
      auth = options.authentication
      if not auth
        return reject status: 401, message: 'You do not have access rights to this URL'
      
      resolve auth.user.map()


  login: (object, options) ->
   
    new Promise (resolve, reject) ->
      validate object
      User.findOne(username: object.username).then (user) ->
        if not user
          return reject status: 404, message: 'no such user'
      
        if not user.authenticate object.password
          return reject status: 401, message: 'incorrect password'
      
        resolve user.map()
        


module.exports = users
