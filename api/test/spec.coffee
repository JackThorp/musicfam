app     = require "../src/index.coffee"
should  = require "should"

describe "Writing node with cs", ->
  
  it "should be a breeze", ->
    true

  it "should still be possible to test real code", ->
    app.greeting("me").should.equal "Hello me"

  it "should generate a farewell message", ->
    app.farewell("rich").should.equal "ta ta rich"

