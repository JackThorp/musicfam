mongoose  = require 'mongoose'
Schema    = mongoose.Schema

ListSchema = new Schema {url: {type: String, required: true}}

module.exports = mongoose.model 'List', ListSchema
