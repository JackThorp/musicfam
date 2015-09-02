
list  = require './list.coffee'
user  = require './user.coffee'
_     = require 'lodash'


# Not yet using this pattern
models =
  exludes: []

  init: () ->
    self = this

    # Could require and assign Base object here to give model index a base set of functionality

    # Require all the files into this directory.
    requireTree.readAll(__dirname, followSymlinks: false).then (modelFiles) ->
      
      _.each modelFiles, (path, fileName) ->

        # Return early if we dont want to include the file.
        if _.contains self.excludes, fileName then return

        file = require path
        
        # Cache its export object into thie object.
        _.extend self, file


module.exports =
  List: list
  User: user
