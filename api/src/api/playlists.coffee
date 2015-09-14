# Playlists API
# RESTful API for Playlist resource
_         = require 'lodash'
Playlist  = require('../models').Playlist
ytClient  = require '../utils/youtubeClient'
Promise   = require 'bluebird'

Playlists =

  editorsEqual: (ed1, ed2) ->
    if ed1.length != ed2.length then return false
    _.reduce (_.zipWith ed1, ed2, Object.prototype.equals), (a, b) -> a && b

  browse: (options) ->
    Playlist
      .find({})
      .populate('editors', 'username')
      .populate('owner', 'username')
      .exec()
      .then (playlists) ->
        _.map playlists, (playlist) -> playlist.toObject(virtuals: true)


  read: (options) ->
    Playlist
      .findById(options.id)
      .populate('editors', 'username')
      .populate('owner', 'username')
      .exec()
      .then (playlist) ->
        
        if not playlist then throw
          status: 404, message: 'No Playlist found with id matching ' + options.id
        
        playlist.toObject(virtuals:true)


  add: (object, options) ->

    # Set the Playlist owner and add them as an editor of the Playlist. 
    object.owner = options.user._id
    if not object.editors then object.editors = [];

    # Fetch track titles (could be in a pre save hook?)
    if not object.tracks then object.tracks = [];
    trackInfo = []
    trackInfo.push ytClient.getTrackTitle(track.url) for track in object.tracks

    Promise.settle(trackInfo).then (trackInfo) ->
      for track, i in trackInfo
        if track.isFulfilled() then object.tracks[i].title = track.value()
      
      new Playlist(object).save()
    


  edit: (object, options) ->
    Playlist.findById(options.id).then (Playlist) ->

      # If Playlist could not be found return 404
      if not Playlist then throw
        status: 404, message: 'No Playlist found with id: ' + options.id

      userId = options.user._id
      owner = userId.equals(Playlist.owner)
      editor = Playlist.editors.some (eid) -> userId.equals eid

      # Only editors and owner are allowed to modify this resource
      if not editor and not owner then throw
        status: 401, message: 'You do not have permissions to modify this playPlaylist' 

      trackInfo = []
      trackInfo.push ytClient.getTrackTitle(track.url) for track in object.tracks

      Promise.settle(trackInfo).then (trackInfo) ->
        for track, i in trackInfo
          if track.isFulfilled() then object.tracks[i].title = track.value()
        # If Playlist is found, update the model and save
        _.extend Playlist, object
        Playlist.save()


  destroy: (options) ->

    Playlist.findById(options.id).then (Playlist) ->

      # If Playlist could not be found return 404
      if not Playlist then throw
        status: 404
        message: 'No Playlist found with id: ' + options.id

      if not options.user._id.equals(Playlist.owner) then throw
        status: 401
        message: 'You do not have permissions to delete this playPlaylist'

      Playlist.remove _id: options.id


module.exports = Playlists
