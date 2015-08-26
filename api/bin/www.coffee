conf  = require '../src/config'

# Module dependencies
app   = require '../src/index.coffee'

port = process.env.PORT || conf.port

app.listen port
console.log "app listening on port #{port}"

# Remeber to be careful when connection to db and then attempting to run tests and dev machine
# at the same time. Had a problem 'connect' over 'createConnection' when running superTest and
# node server at same time. 

mongoose  = require 'mongoose'
mongoose.connect conf.mongodb

