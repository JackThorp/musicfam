# Lists API
# RESTful API for List resource
Promise = require 'bluebird'
_       = require 'lodash'
List    = require('../models').List

lists =

  browse: (options) ->
    List.find({})


  read: (options) ->
    List.findById options.id


  add: (object, options) ->
    new List(object).save().then((list) ->
        list
      ).then null, (err) ->
        if err.name == 'ValidationError' then throw
          status: 403
          message: err?.errors


  edit: (object, options) ->
    List.findById(options.id).then (list) ->
    
      # If list could not be found return 404
      if not list then throw
        status: 404
        message: 'No list found with id: ' + options.id
      
      # If list is found, update the model and save
      _.extend list, object
      list.save()


  destroy: (options) ->
    List.remove _id: options.id


module.exports = lists
