mongoose       = require 'mongoose'
playlistSchema = require './playlist-schema'

module.exports = mongoose.model 'Playlist', playlistSchema
