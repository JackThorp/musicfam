## Set the environment to testing so we use test db.
#process.env.NODE_ENV = 'test'
#
#testHelpers = require '../testHelpers'
#expect      = require('chai').expect
#_           = require 'lodash'
#mongoose    = require 'mongoose'
#conf        = require '../../src/config'
#
## Must connect to database explicitly as not running app.
#mongoose.connect conf.mongodb
#
## Load the model to be tested
#List      = require('../../src/models').List
#mockLists = require '../mocks/List.json'
#
#before (done) ->
# testHelpers.clearDatabase done
# 
#describe 'List Model', () ->
# 
#  # Load a set of mock lists into the database. 
#  before (done) ->
#    testHelpers.populateModel List, mockLists, done
#
#  it 'should return all lists in database', (done) ->
#    List.find({}).then (lists) ->
#      expect(lists).length.to.be 2
#      
#      l1 = _.find lists,  name: mockLists[0].name
#      expect(l1).to.be.ok
#      expect(l1.tracks).length.to.be 3
#      
#      l2 = _.find lists, name: mockLists[1].name
#      expect(l2).to.be.ok
#      expect(l2.tracks).length.to.be 2
#      
#      done()
#    
#
#after (done) ->
#  testHelpers.clearDatabase done
