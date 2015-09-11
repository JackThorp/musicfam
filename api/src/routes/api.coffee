# API ROUTES
express = require 'express'
api     = require '../api'
mw 			= require '../middleware'

router = express.Router()

# - - LISTS - -
router.get      '/playlists',     							api.http api.playlists.browse
router.post     '/playlists',     mw.loggedIn,	api.http api.playlists.add
router.get      '/playlists/:id', 							api.http api.playlists.read
router.put      '/playlists/:id', mw.loggedIn,	api.http api.playlists.edit
router.delete   '/playlists/:id', mw.loggedIn,	api.http api.playlists.destroy

# - - USERS - -
router.get			'/users',				api.http api.users.browse
router.post     '/users',       api.http api.users.add
router.post     '/users/login', api.http api.users.login
router.get      '/users/login', api.http api.users.read

module.exports = router
