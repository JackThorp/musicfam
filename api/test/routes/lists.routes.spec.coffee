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

before (done) ->
  mongoose.connect require('../../src/config').mongodb
  testHelpers.clearDatabase done

after (done) ->
  testHelpers.clearDatabase ->
    mongoose.disconnect()
    done()

describe 'List API routes', () ->

  beforeEach (done) ->
    app = require '../../src/index'
    testHelpers.populateModel List, mockLists, done
    
  describe 'GET /api/lists', () ->

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



  describe 'POST /api/lists', () ->

    it 'should add a new list to the backend', (done) ->
      request(app)
        .post('/api/lists')
        .set('Content-Type', 'application/json')
        .send( name: "empty list", tracks: [] )
        .expect(200)
        .end (err, res) ->
          request(app)
            .get('/api/lists')
            .expect(200)
            .end (err, res) ->
              expect(res.body).length.to.be 3
              done()

    it 'should 403 on a post without a list name', (done) ->
      request(app)
        .post('/api/lists')
        .set('Content-Type', 'application/json')
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
        .send(name: 'bad list', tracks: [], type: 'music')
        .end (err, res) ->
          request(app)
            .get('/api/lists')
            .end (err, res) ->
              list = _.find res.body, name: 'bad list'
              expect(list.type).to.not.be.ok
              done()


  describe 'PUT /api/lists/:id', ->

    it 'should update a list with new data', (done) ->
      
      request(app)
        .get('/api/lists')
        .end (err, res) ->
          list = res.body[0]
          expect(list.tracks).length.to.be 3
          request(app)
            .put('/api/lists/' + list._id)
            .send(name: list.name, tracks: [{url: "www.reset.com"}])
            .expect(200)
            .end (err, res) ->
              request(app)
                .get('/api/lists')
                .end (err, res) ->
                  expect(res.body[0].tracks).length.to.be 1
                  done()
      
      
    it 'should return a 404 if no list exists with id', (done) ->

      request(app)
        .put('/api/lists/00000000c485fe6f47573862')
        .send({})
        .expect(404)
        .end done


  describe 'DELETE /api/lists/:id', ->

    it 'should remove list from the database', (done) ->

      request(app)
        .get('/api/lists')
        .end (err, res) ->
          listID = res.body[0]._id
          request(app)
            .delete('/api/lists/' + listID)
            .expect(200)
            .end (res, err) ->
              request(app)
                .get('/api/lists')
                .end (err, res) ->
                  oldList = _.find res.body, _id: listID
                  expect(oldList).not.to.be.ok
                  done()
