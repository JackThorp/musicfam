conf  = require '../src/config'

# Module dependencies
app   = require '../src/index.coffee'
http	= require 'http'

port = process.env.PORT || conf.port
app.set 'port', port

server = http.createServer(app)

server.on 'error', (err) -> console.log err
server.on 'listen', () -> console.log "app listening on port #{port}"


PlaylistSchema = require('../src/models/playlist-schema')

# - - SOCKETS - -
# MUST COME BEFORE server.listen()! 
io = require('socket.io') server

io.on 'connection', (socket) ->
  console.log 'client connected'

  PlaylistSchema.post 'save', (doc) ->
    console.log '%s has been saved', doc._id
    socket.emit 'saved-playlist', doc

  PlaylistSchema.post 'remove', (doc) ->
    console.log '%s has been removed', doc._id
    socket.emit 'del-playlist', doc

server.listen(port);

# Remeber to be careful when connection to db and then attempting to run tests and dev machine
# at the same time. Had a problem 'connect' over 'createConnection' when running superTest and
# node server at same time. 

mongoose  = require 'mongoose'
mongoose.connect conf.mongodb

serverErrorHandler = (err) ->
	console.log err

serverStartHandler = () ->
	console.log "app listening on port #{port}"
