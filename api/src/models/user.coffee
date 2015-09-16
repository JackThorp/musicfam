mongoose    = require 'mongoose'
UserSchema  = require './user-schema'

module.exports = mongoose.model 'User', UserSchema


