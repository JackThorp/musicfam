models    = require '../src/models'
mongoose  = require 'mongoose'
populated = {}
db = false
process.env.NODE_ENV = 'test'

clearDatabase = (next) ->
  
  i = 0
  dbs = []

  for key, val of models
    dbs.push val

  clear = ->
    if not dbs[i] then return

    dbs[i].remove (err) ->
      if err then console.error err
      i++
      clear()

  clear()
  next()


# Only works on assumption that database has been cleared? 
populateModel = (model, mocks, next) ->
  model.create mocks, next

connect = ->
  if db then return db
  db = mongoose.connect require('../src/config').mongodb

disconnect = ->
  db?.connection?.close()

module.exports =
  clearDatabase: clearDatabase
  populateModel: populateModel
  connect: connect
  disconnect: disconnect
