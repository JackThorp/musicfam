ytClient  = require './youtubeClient'
Promise   = require 'bluebird'

trackEnhancer =

	getTrackInfo: (tracks) ->
		trackInfo = []
		trackInfo.push ytClient.getTrackTitle(track.url) for track in tracks

		Promise.settle(trackInfo).then (trackInfo) ->
			for newTrack, i in trackInfo
				if newTrack.isFulfilled() then tracks[i].title = newTrack.value()
			tracks
	
	log: (msg) ->
		console.log msg


module.exports = trackEnhancer