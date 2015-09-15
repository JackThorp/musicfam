conf  = require '../src/config'

# Module dependencies
app   = require '../src/index.coffee'
http	= require 'http'

port = process.env.PORT || conf.port
app.set 'port', port

server = http.createServer(app)

server.on 'error', (err) -> console.log err
server.on 'listen', () -> console.log "app listening on port #{port}"


# Listen for web socket connections. 
# MUST COME BEFORE server.listen()! 
io = require('socket.io').listen(server)
require('../src/sockets').setSocket io
app.set 'io', io

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
