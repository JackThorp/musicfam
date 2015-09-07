# Lists API
# RESTful API for List resource
Promise = require 'bluebird'
_       = require 'lodash'
List    = require('../models').List

lists =

  browse: (options) ->
    List.find({})


  read: (options) ->
    List.findById(options.id).then (list) ->
      if not list then throw
        status: 404
        message: 'No list found with id matching ' + options.id

      list


  add: (object, options) ->

    new Promise (resolve, reject) ->

      # if this is not a logged in user then throw error
      # Can't see how ghost do authentication on first glance. Seems bad to add this to each handler.
      if not options.authentication then throw
        status: 401
        message: 'You must be logged in to create a new playlist'

      if not object.ownerID then object.ownerID = options.authentication.user._id

      new List(object).save().then((list) ->
          resolve list
        ).then null, (err) ->
          if err.name == 'ValidationError' then reject
            status: 403
            message: err?.errors


  edit: (object, options) ->
    List.findById(options.id).then (list) ->

      if not options.authentication then throw
        status: 401
        message: 'You must be logged in to edit a playlist'

      # If list could not be found return 404
      if not list then throw
        status: 404
        message: 'No list found with id: ' + options.id

      if not options.authentication.user._id.equals(list.ownerID) then throw
        status: 401
        message: 'You do not have permissions to modify this playlist' 
      
      # If list is found, update the model and save
      _.extend list, object
      list.save()


  destroy: (options) ->

    List.findById(options.id).then (list) ->
      
      if not options.authentication then throw
        status: 401
        message: 'You must be logged in to delete a playlist'

      # If list could not be found return 404
      if not list then throw
        status: 404
        message: 'No list found with id: ' + options.id

      if not options.authentication.user._id.equals(list.ownerID) then throw
        status: 401
        message: 'You do not have permissions to delete this playlist'

      List.remove _id: options.id


module.exports = lists
