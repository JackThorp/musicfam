mongoose  = require 'mongoose'

Schema    = mongoose.Schema

UrlSchema = new Schema
  url:
    type: String
    required: true

ListSchema = new Schema
  tracks: [UrlSchema]
  name:
    type: String
    required: true
  ownerID:
  	type: Schema.Types.ObjectId
  	required: true

module.exports = mongoose.model 'List', ListSchema
