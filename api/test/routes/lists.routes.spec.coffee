# Set the env so we use the test database.
process.env.NODE_ENV = "test"

expect        = require('chai').expect
request       = require 'supertest'
testHelpers   = require '../testHelpers'
List          = require('../../src/models').List
mockLists     = require '../mocks/List.json'
_             = require 'lodash'
mongoose      = require 'mongoose'

app = {}
authToken = {}
authToken2 = {}
user = {}
users = [{username:'jack', password:'god'}, {username:'maria', password:'gone'}]

before (done) ->
  testHelpers.connect()
  testHelpers.clearDatabase done

after (done) ->
  testHelpers.clearDatabase ->
    testHelpers.disconnect()
  done()
    

describe 'List API routes', ->

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
                testHelpers.populateModel List, mockLists, done


  describe 'GET /api/lists', ->

    it 'should return array of lists', (done) ->

      request(app)
        .get('/api/lists')
        .expect(200)
        .end (err, res) ->
          lists = res.body
          expect(lists).length.to.be 2
      
          l1 = _.find lists,  name: mockLists[0].name
          expect(l1).to.be.ok
          expect(l1.tracks).length.to.be 3
        
          l2 = _.find lists, name: mockLists[1].name
          expect(l2).to.be.ok
          expect(l2.tracks).length.to.be 2
 
          done()

  describe 'GET /api/lists/:id', ->
    it 'should retrieve a list by id', (done) ->
      request(app)
        .get('/api/lists')
        .end (err, res) ->
          listA = res.body[0]
          request(app)
            .get('/api/lists/' + listA._id)
            .end (err, res) ->
              listB = res.body
              expect(listA).to.deep.equal listB
              done()

  describe 'POST /api/lists', ->
    it 'should be blocked if no authentication provided', (done) ->
      request(app)
        .post('/api/lists')
        .set('Content-Type', 'application/json')
        .send( name: "empty list", tracks: [] )
        .expect(401)
        .end (err, res) ->
          if err then return done err
          done()

    it 'should add a new list to the backend WITH correct user ID', (done) ->
      request(app)
        .post('/api/lists')
        .set('Content-Type', 'application/json')
        .set('X-Auth-Token', authToken)
        .send( name: "empty list", tracks: [] )
        .expect(200)
        .end (err, res) ->
          request(app)
            .get('/api/lists/' + res.body._id)
            .expect(200)
            .end (err, res) ->
              expect(res.body.ownerID).to.be.ok
              expect(res.body.ownerID).to.equal user._id
              done()

    it 'should 403 on a post without a list name', (done) ->
      request(app)
        .post('/api/lists')
        .set('Content-Type', 'application/json')
        .set('X-Auth-Token', authToken)
        .send( name: null, tracks: [] )
        .expect(403)
        .end (err, res) ->
          if err then return done err
          expect(res.body.message).to.be.ok
          done()

    it 'should not post object with unknown fields', (done) ->
      request(app)
        .post('/api/lists')
        .set('Content-Type', 'application/json')
        .set('X-Auth-Token', authToken)
        .send(name: 'bad list', tracks: [], type: 'music')
        .end (err, res) ->
          if err then return done err
          request(app)
            .get('/api/lists')
            .end (err, res) ->
              if err then return done err
              list = _.find res.body, name: 'bad list'
              expect(list.type).to.not.be.ok
              done()


  describe 'PUT /api/lists/:id', ->

    it 'should be blocked if the request is not from the list owner', (done) ->
      request(app)
        .post('/api/lists')
        .set('Content-Type', 'application/json')
        .set('X-Auth-Token', authToken)
        .send( name: "empty list", tracks: [] )
        .end (err, res) ->
          if err then return done err
          request(app)
            .put('/api/lists/' + res.body._id)
            .set('X-Auth-Token', authToken2)
            .send(name: "full list", tracks: [])
            .expect(401)
            .end (err, res) ->
              if err then return done err
              expect(res.body.message).to.be.ok
              done()
    
    it 'should update a list with new data', (done) ->
      
      request(app)
        .post('/api/lists')
        .set('X-Auth-Token', authToken)
        .send( name: "triplet list", tracks: [{url: "www.one.com"},{url: "www.two.com"},{url: "www.three.com"}] )
        .end (err, res) ->
          if err then return done err
          list = res.body
          expect(list.tracks).length.to.be 3

          request(app)
            .put('/api/lists/' + list._id)
            .set('X-Auth-Token', authToken)
            .send(name: list.name, tracks: [{url: "www.reset.com"}])
            .expect(200)
            .end (err, res) ->
              if err then return done err
              expect(res.body.tracks).length.to.be 1
              done()
      
      
    it 'should return a 404 if no list exists with id', (done) ->

      request(app)
        .put('/api/lists/' + mongoose.Types.ObjectId())
        .set('X-Auth-Token', authToken)
        .send({})
        .expect(404)
        .end done


  describe 'DELETE /api/lists/:id', ->

    it 'should be blocked if the request is not authenticated by the owner', (done) ->
      request(app)
        .post('/api/lists')
        .set('Content-Type', 'application/json')
        .set('X-Auth-Token', authToken)
        .send( name: "empty list", tracks: [] )
        .end (err, res) ->
          if err then return done err
          request(app)
            .delete('/api/lists/' + res.body._id)
            .set('X-Auth-Token', authToken2)
            .send({})
            .expect(401)
            .end (err, res) ->
              if err then return done err
              expect(res.body.message).to.be.ok
              done()

    it 'should remove list from the database', (done) ->

      request(app)
        .post('/api/lists')
        .set('X-Auth-Token', authToken)
        .send( name: "empty list", tracks: [] )
        .end (err, res) ->
          list = res.body
          request(app)
            .delete('/api/lists/' + list._id)
            .set('X-Auth-Token', authToken)
            .expect(200)
            .end (err, res) ->
              if err then return done err
              request(app)
                .get('/api/lists/' + list._id)
                .expect(404)
                .end (err, res) ->
                  if err then return done err
                  expect(res.body.message).to.be.ok
                  done()


