# Playlists API
# RESTful API for Playlist resource
Promise   = require 'bluebird'
Promise.promisifyAll require 'mongoose'

_         = require 'lodash'
Playlist  = require('../models').Playlist

Playlists =

  editorsEqual: (ed1, ed2) ->
    if ed1.length != ed2.length then return false
    _.reduce (_.zipWith ed1, ed2, Object.prototype.equals), (a, b) -> a && b

  browse: (options) ->
    Playlist
      .find({})
      .populate('editors', 'username')
      .exec()
      .then (playlists) ->
        _.map playlists, (playlist) -> playlist.toObject(virtuals: true)



  read: (options) ->
    Playlist
      .findById(options.id)
      .populate('editors', 'username')
      .then (playlist) ->
        
        if not playlist then throw
          status: 404, message: 'No Playlist found with id matching ' + options.id
        
        playlist.toObject(virtuals:true)


  add: (object, options) ->

    new Promise (resolve, reject) ->

      # if this is not a logged in user then throw error
      # Can't see how ghost do authentication on first glance. Seems bad to add this to each handler.
      if not options.authentication then throw
        status: 401
        message: 'You must be logged in to create a new playPlaylist'

      # Set the Playlist owner and add them as an editor of the Playlist. 
      object.ownerID = options.authentication.user._id
      if not object.editors then object.editors = [];

      new Playlist(object).save().then((Playlist) ->
          resolve Playlist
        ).then null, (err) ->
          if err.name == 'ValidationError' then reject
            status: 403, message: err?.errors


  edit: (object, options) ->
    Playlist.findById(options.id).then (Playlist) ->

      if not options.authentication then throw
        status: 401, message: 'You must be logged in to edit a playPlaylist'

      # If Playlist could not be found return 404
      if not Playlist then throw
        status: 404, message: 'No Playlist found with id: ' + options.id

      userId = options.authentication.user._id
      owner = userId.equals(Playlist.ownerID)
      editor = Playlist.editors.some (eid) -> userId.equals eid

      # Only editors and owner are allowed to modify this resource
      if not editor and not owner then throw
        status: 401, message: 'You do not have permissions to modify this playPlaylist' 

      # If Playlist is found, update the model and save
      _.extend Playlist, object
      Playlist.save()


  destroy: (options) ->

    Playlist.findById(options.id).then (Playlist) ->
      
      if not options.authentication then throw
        status: 401
        message: 'You must be logged in to delete a playPlaylist'

      # If Playlist could not be found return 404
      if not Playlist then throw
        status: 404
        message: 'No Playlist found with id: ' + options.id

      if not options.authentication.user._id.equals(Playlist.ownerID) then throw
        status: 401
        message: 'You do not have permissions to delete this playPlaylist'

      Playlist.remove _id: options.id


module.exports = Playlists
