ytClient  = require './youtubeClient'
Promise   = require 'bluebird'

trackEnhancer =

	getTrackInfo: (tracks) ->
		trackInfo = []
		trackInfo.push ytClient.getTrackInfo(track.url) for track in tracks

		Promise.settle(trackInfo).then (trackInfo) ->
			for newTrack, i in trackInfo
				if newTrack.isFulfilled()
					newTrackInfo = newTrack.value()
					tracks[i].title = newTrackInfo.title
					tracks[i].videoId = newTrackInfo.videoId
			tracks
	
	log: (msg) ->
		console.log msg


module.exports = trackEnhancer