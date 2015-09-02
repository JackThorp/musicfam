# Set the env so we use the test database.
process.env.NODE_ENV = "test"

expect        = require('chai').expect
request       = require 'supertest'
testHelpers   = require '../testHelpers'

User          = require('../../src/models').User
mockUsers     = require '../mocks/User.json'
_             = require 'lodash'
mongoose      = require 'mongoose'

app = {}

before (done) ->
  testHelpers.connect()
  testHelpers.clearDatabase done

after (done) ->
  testHelpers.clearDatabase ->
    testHelpers.disconnect()
  done()
    

describe 'User API routes', () ->

  beforeEach (done) ->
    app = require '../../src/index'
    testHelpers.populateModel User, mockUsers, done
    
  describe 'Registration POST /api/users', () ->

    it 'should return a JWT if valid', (done) ->

      request(app)
        .post('/api/users')
        .send(username: 'ibble dibble', password: 'god')
        .expect(200)
        .end (err, res) ->
          if err then return done err
          expect(res.body?.user?.username).to.be.ok
          expect(res.body?.accessToken).to.be.ok
          done()

    it 'should return 400 if there are missing fields', (done) ->
      
      request(app)
        .post('/api/users')
        .send( username: 'bt')
        .expect(400)
        .end (err, res) ->
          if err then return done err
          expect(res.body?.message).to.be.ok
          done()
  
  
  describe 'Login POST /api/users/login', ->
    it 'should return 404 if user does not exist', (done) ->

      request(app)
        .post('/api/users/login')
        .send( username: 'dakcbre', password: 'truth')
        .expect(404)
        .end (err, res) ->
          if err then return done err
          expect(res.body?.message).to.be.ok
          done()
    
    it 'should return a 401 if user supplies incorrect password', (done) ->

      request(app)
        .post('/api/users')
        .send( username: 'bob', password: 'right')
        .expect(200)
        .end (err, res) ->
          if err then return done err
          request(app)
            .post('/api/users/login')
            .send( username: 'bob', password: 'wrong')
            .expect(401)
            .end (err, res) ->
              if err then return done err
              expect(res.body?.message).to.be.ok
              done()

    it 'should return a JWT if cedentials are valid', (done) ->

      request(app)
        .post('/api/users')
        .send( username: 'bob', password: 'right')
        .expect(200)
        .end (err, res) ->
          if err then return done err
          request(app)
            .post('/api/users/login')
            .send( username: 'bob', password: 'right')
            .expect(200)
            .end (err, res) ->
              if err then return done err
              expect(res.body?.accessToken).to.be.ok
              done()





