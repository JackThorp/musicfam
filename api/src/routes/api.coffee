# API ROUTES
express = require 'express'
api     = require '../api'
middleware = require '../middleware'

router = express.Router()

# - - LISTS - -
router.get      '/lists',     api.http api.lists.browse
router.post     '/lists',     api.http api.lists.add
router.get      '/lists/:id', api.http api.lists.read
router.put      '/lists/:id', api.http api.lists.edit
router.delete   '/lists/:id', api.http api.lists.destroy

# - - USERS - -
router.post     '/users',       api.http api.users.add
router.post     '/users/login', api.http api.users.login
router.get      '/users/login', api.http api.users.read

module.exports = router
