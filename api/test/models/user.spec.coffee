# Set the environment to testing so we use test db.
process.env.NODE_ENV = 'test'

testHelpers = require '../testHelpers'
expect      = require('chai').expect
_           = require 'lodash'

# Load the model to be tested
User      = require('../../src/models').User
db = {}

before (done) ->
  testHelpers.connect()
  testHelpers.clearDatabase done
 
describe 'User Model', ->
 
  describe 'setting the password', ->
    
    it 'should add a salt and hash to the model', (done) ->
      User.create {username: 'jack'}, (err, user) ->
        if err then done err
        expect(user.salt).not.to.be.ok
        expect(user.hash).not.to.be.ok
        user.setPassword 'god'
        user.save (err, saltyUser) ->
          expect(saltyUser.salt).to.be.ok
          expect(saltyUser.hash).to.be.ok
          done()

  describe 'authentication', ->
    it 'should fail if the password is incorrect', (done) ->
      User.create {username: 'jack'}, (err, user) ->
        if err then done err
        user.setPassword 'sex'
        isAuthed = user.authenticate 'love'
        expect(isAuthed).not.to.be.ok
        done()

    it 'should succeed if the password is correct', (done) ->
      User.create {username: 'jack'}, (err, user) ->
        if err then done err
        user.setPassword 'sex'
        isAuthed = user.authenticate 'sex'
        expect(isAuthed).to.be.ok
        done()

  describe 'mapping the user', ->
    it 'should return a user object and an accessToken', (done) ->
      User.create {username: 'plisken'}, (err, user) ->
        mappedUser = user.map()
        expect(mappedUser?.user?.username).to.be.ok
        expect(mappedUser.accessToken).to.be.ok
        done()

after (done) ->
  testHelpers.clearDatabase ->
    testHelpers.disconnect()
  done()
