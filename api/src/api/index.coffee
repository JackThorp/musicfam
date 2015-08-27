_     = require 'lodash'
lists = require './lists'

http = (apiMethod) ->
  
  (req, res, next) ->
    
    # Define 2 arguments to be passed into API calls: object & options
    object  = req.body
    options = _.extend {}, req.files, req.query, req.params, {context: {user: req?.user?.id}}

    # For GET & DELETE req.body should be null so we move options into object
    if not object || _.isEmpty object
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
  http: http,
  lists: lists
}
