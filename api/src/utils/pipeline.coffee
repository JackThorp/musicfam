Promise = require 'bluebird'

# First argument is array of functions, second is options object
pipeline = (tasks, args...) ->

  #promise.all returns a promise for all tasks being completed
  # promise.reduce takes js promise for an array and either reduces or
  # rejects promise if array promise was not fulfilled. 
  tasks.reduce ((arg, task) ->
      console.log 'arg: ' + arg
      task.apply null, arg
  ), args

    #Promise.resolve(runTask(task, arg)

module.exports = pipeline
