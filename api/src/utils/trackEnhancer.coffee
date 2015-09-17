ytClient  = require './youtubeClient'
Promise   = require 'bluebird'
_					= require 'lodash'

trackEnhancer =

	getTrackInfo: (tracks) ->
		trackInfo = []
		trackInfo.push ytClient.getTrackInfo(track.url) for track in tracks

		Promise.settle(trackInfo).then (trackInfo) ->
			for trackData, i in trackInfo
				_.extend(tracks[i], trackData.value())
			tracks

module.exports = trackEnhancer