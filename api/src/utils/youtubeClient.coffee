axios 	= require 'axios'
Promise = require 'bluebird'

apiKey = 'AIzaSyAUwdWKlqYbj4YmcwjTXTw2ZnnfoAKdyms'
apiURL = 'https://www.googleapis.com/youtube/v3'

youtubeClient =

	getTitle: (videoId) ->
		if !videoId then return Promise.resolve(null)
		axios
			.get(apiURL + "/videos?part=snippet&id=#{videoId}&fields=items%2Fsnippet%2Ftitle&key=#{apiKey}")
			.then (response) -> response?.data?.items[0]?.snippet?.title 
		
	getVideoId: (url) ->
		regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
		match = url.match regExp
		if match && match[2].length == 11
  		match[2];
		else
			null

	getTrackTitle: (url) ->
		vidId = this.getVideoId url
		this.getTitle(vidId)

	getTrackInfo: (url) ->
		videoId = this.getVideoId url
		this.getTitle(videoId).then (title) ->
			title: title, videoId: videoId



module.exports = youtubeClient