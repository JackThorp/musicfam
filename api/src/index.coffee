conf    = require './config'
express = require 'express'

app = express()
bodyParser = require 'body-parser'

List = require './models/list'

app.use bodyParser.json()

app.use (req, res, next) ->
  res.header 'Access-Control-Allow-Origin', '*'
  res.header 'Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS'
  res.header 'Access-Control-Allow-Headers', 'X-Auth-Token, Content-Type'
  next()


app.get '/lists', (req, res) ->
  
  List.find({}).then (lists) ->
    res.json lists
 
app.post '/lists', (req, res) ->
  console.log req.body
  new List(req.body).save()
  res.sendStatus(200)


app.use (req, res, next) ->
  err = new Error 'Nothing For You Here'
  res.status = 500
  res.json { message: err.message, error: err}


app.listen 3000
console.log "app listening on port 3000"

mongoose = require 'mongoose'
mongoose.connect conf.mongodb
