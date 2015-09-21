# Set the env so we use the test database.
process.env.NODE_ENV = "test"

expect        = require('chai').expect
request       = require 'supertest'
testHelpers   = require '../testHelpers'
Playlist      = require('../../src/models').Playlist
mockLists     = require '../mocks/List.json'
_             = require 'lodash'
mongoose      = require 'mongoose'

app = {}
authToken = {}
authToken2 = {}
user = {}
user2 = {}
users = [{username:'jack', password:'god'}, {username:'maria', password:'gone'}]

before (done) ->
  testHelpers.connect()
  testHelpers.clearDatabase done

after (done) ->
  testHelpers.clearDatabase ->
    testHelpers.disconnect()
  done()
    

describe 'Playlist API routes', ->

  #Adds two users and populates the database with som eplaylists
  beforeEach (done) ->
    app = require '../../src/index'
    testHelpers.clearDatabase ->
      request(app)
          .post('/api/users')
          .send(username: 'jack', password: 'god')
          .end (err, res) ->
            authToken = res.body.accessToken
            user = res.body.user
            request(app)
              .post('/api/users')
              .send(username: 'maria', password: 'gone')
              .end (err, res) ->
                authToken2 = res.body.accessToken
                user2 = res.body.user
                testHelpers.populateModel Playlist, mockLists, done


  describe 'GET /api/playlists', ->

    it 'should return array of playlists', (done) ->

      request(app)
        .get('/api/playlists')
        .expect(200)
        .end (err, res) ->
          playlists = res.body
          expect(playlists).length.to.be 2
      
          l1 = _.find playlists,  name: mockLists[0].name
          expect(l1).to.be.ok
          expect(l1.tracks).length.to.be 3
        
          l2 = _.find playlists, name: mockLists[1].name
          expect(l2).to.be.ok
          expect(l2.tracks).length.to.be 2
 
          done()

  describe 'GET /api/playlists/:id', ->
    it 'should retrieve a list by id', (done) ->
      request(app)
        .get('/api/playlists')
        .end (err, res) ->
          pl1 = res.body[0]
          request(app)
            .get('/api/playlists/' + pl1._id)
            .end (err, res) ->
              pl2 = res.body
              expect(pl1).to.deep.equal pl2
              done()

  describe 'POST /api/playlists', ->
   
    it 'should add a new playlist to the backend WITH correct user ID & owner', (done) ->
      request(app)
        .post('/api/playlists')
        .set('Content-Type', 'application/json')
        .set('X-Auth-Token', authToken)
        .send( name: "empty list", tracks: [], editors: [user2._id] )
        .expect(200)
        .end (err, res) ->
          request(app)
            .get('/api/playlists/' + res.body._id)
            .expect(200)
            .end (err, res) ->
              playlist = res.body
              expect(playlist.editors).to.be.ok
              expect(playlist.editors).length.to.be 1
              expect(playlist.editors[0]._id == user2._id).to.be.ok
              expect(playlist.owner).to.be.ok
              expect(playlist.owner._id).to.equal user._id
              done()

    it 'should add track names', (done) ->
      request(app)
        .post('/api/playlists')
        .set('Content-Type', 'application/json')
        .set('X-Auth-Token', authToken)
        .send( name: "empty list", tracks: [{url: 'https://www.youtube.com/watch?v=mdbTYxFRi7U&index=2&list=PLpaw6RtD8L6LExZLP0PG89UJZDNMkwIvq'}])
        .expect(200)
        .end (err, res) ->
          request(app)
            .get('/api/playlists/' + res.body._id)
            .expect(200)
            .end (err, res) ->
              playlist = res.body
              expect(playlist.tracks).to.be.ok
              expect(playlist.tracks[0].title).to.be.ok
              done()
    
    it 'should populate addedBy field', (done) ->
      request(app)
        .post('/api/playlists')
        .set('Content-Type', 'application/json')
        .set('X-Auth-Token', authToken)
        .send( name: "wagwan", tracks: [{url: 'www.rmf.com', addedBy: user2._id}])
        .expect(200)
        .end (err, res) ->
          request(app)
            .get('/api/playlists/' + res.body._id)
            .expect(200)
            .end (err, res) ->
              if err then done err
              playlist = res.body
              expect(playlist.tracks).to.be.ok
              expect(playlist.tracks[0].addedBy).to.be.ok
              done()
        
    it 'should be blocked if no authentication provided', (done) ->
      request(app)
        .post('/api/playlists')
        .set('Content-Type', 'application/json')
        .send( name: "empty list", tracks: [] )
        .expect(401)
        .end (err, res) ->
          if err then return done err
          done()

    it 'should respond with 403 if post contains no name', (done) ->
      request(app)
        .post('/api/playlists')
        .set('Content-Type', 'application/json')
        .set('X-Auth-Token', authToken)
        .send( name: null, tracks: [] )
        .expect(403)
        .end (err, res) ->
          if err then return done err
          expect(res.body.message).to.be.ok
          done()

    it 'should not post playlist with extra fields', (done) ->
      request(app)
        .post('/api/playlists')
        .set('Content-Type', 'application/json')
        .set('X-Auth-Token', authToken)
        .send(name: 'bad list', tracks: [], type: 'music')
        .end (err, res) ->
          if err then return done err
          request(app)
            .get('/api/playlists')
            .end (err, res) ->
              if err then return done err
              list = _.find res.body, name: 'bad list'
              expect(list.type).to.not.be.ok
              done()


  describe 'PUT /api/playlists/:id', ->

    it 'should be blocked if the request is not from the owner or editor', (done) ->
      request(app)
        .post('/api/playlists')
        .set('Content-Type', 'application/json')
        .set('X-Auth-Token', authToken)
        .send( name: "empty list", tracks: [] )
        .end (err, res) ->
          if err then return done err
          request(app)
            .put('/api/playlists/' + res.body._id)
            .set('X-Auth-Token', authToken2)
            .send(name: "full list", tracks: [])
            .expect(401)
            .end (err, res) ->
              if err then return done err
              expect(res.body.message).to.be.ok
              done()
    
    it 'should update a list with new data', (done) ->
      
      request(app)
        .post('/api/playlists')
        .set('X-Auth-Token', authToken)
        .send( name: "triplet list", tracks: [{url: "www.one.com"},{url: "www.two.com"},{url: "www.three.com"}] )
        .end (err, res) ->
          if err then return done err
          list = res.body
          expect(list.tracks).length.to.be 3

          request(app)
            .put('/api/playlists/' + list._id)
            .set('X-Auth-Token', authToken)
            .send(name: list.name, tracks: [{url: "www.reset.com"}], editors:[mongoose.Types.ObjectId()])
            .expect(200)
            .end (err, res) ->
              if err then return done err
              expect(res.body.tracks).length.to.be 1
              done()
      
      
    it 'should return a 404 if no playlist exists with id', (done) ->

      request(app)
        .put('/api/playlists/' + mongoose.Types.ObjectId())
        .set('X-Auth-Token', authToken)
        .send({})
        .expect(404)
        .end done

    it 'shoule not allow any user to change the owner', (done) ->
      request(app)
        .post('/api/playlists')
        .set('X-Auth-Token', authToken)
        .send( name: "list")
        .expect(200)
        .end (err, res) ->
          if err then return done err
          list = res.body
          request(app)
            .put('/api/playlists/' + list._id)
            .set('X-Auth-Token', authToken)
            .send(owner: _id: mongoose.Types.ObjectId())
            .expect(403)
            .end (err, res) ->
              if err then return done err
              expect(res.body.message).to.be.ok
              done()

    it 'should allow an editors to add tracks', (done) ->
      request(app)
        .post('/api/playlists')
        .set('X-Auth-Token', authToken)
        .send( name: "triplet list", tracks: [{url: "www.one.com"}], editors: [user2._id] )
        .end (err, res) ->
          if err then return done err
          list = res.body
          request(app)
            .put('/api/playlists/' + list._id)
            .set('X-Auth-Token', authToken2)
            .send(name: list.name, tracks: [{url: "www.one.com"},{url: "www.two.com"}])
            .expect(200)
            .end (err, res) ->
              if err then return done err
              expect(res.body.tracks).length.to.be 2
              done()


  describe 'DELETE /api/playlists/:id', ->

    it 'should be blocked if the request is not authenticated by the owner', (done) ->
      request(app)
        .post('/api/playlists')
        .set('Content-Type', 'application/json')
        .set('X-Auth-Token', authToken)
        .send( name: "empty list", tracks: [] )
        .end (err, res) ->
          if err then return done err
          request(app)
            .delete('/api/playlists/' + res.body._id)
            .set('X-Auth-Token', authToken2)
            .send({})
            .expect(401)
            .end (err, res) ->
              if err then return done err
              expect(res.body.message).to.be.ok
              done()

    it 'should remove list from the database', (done) ->

      request(app)
        .post('/api/playlists')
        .set('X-Auth-Token', authToken)
        .send( name: "empty list", tracks: [] )
        .end (err, res) ->
          list = res.body
          request(app)
            .delete('/api/playlists/' + list._id)
            .set('X-Auth-Token', authToken)
            .expect(200)
            .end (err, res) ->
              if err then return done err
              request(app)
                .get('/api/playlists/' + list._id)
                .expect(404)
                .end (err, res) ->
                  if err then return done err
                  expect(res.body.message).to.be.ok
                  done()


