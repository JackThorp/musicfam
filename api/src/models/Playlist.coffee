mongoose  = require 'mongoose'

Schema    = mongoose.Schema

UrlSchema = new Schema
  title:
    type: String

  url:
    type: String
    required: true
    

PlaylistSchema = new Schema
  
  name:
    type: String
    required: true
  
  owner:
    type: Schema.Types.ObjectId
    ref: 'User'
    required: true

  # Save as reference to user for mongoose population 
  editors: [{type: Schema.Types.ObjectId, ref: 'User'}]

  tracks: [UrlSchema]

# Virtual method for making HAL response object.
PlaylistSchema.virtual('_links').get ->
  self: href: "http://localhost:3000/api/playlists/" + this._id


module.exports = mongoose.model 'Playlist', PlaylistSchema
