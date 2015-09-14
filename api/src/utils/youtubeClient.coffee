axios = require 'axios'

apiKey = 'AIzaSyAUwdWKlqYbj4YmcwjTXTw2ZnnfoAKdyms'
apiURL = 'https://www.googleapis.com/youtube/v3'
query  = 

youtubeClient =

	getTitle: (videoId) ->
		axios
			.get(apiURL + "/videos?part=snippet&id=#{videoId}&fields=items%2Fsnippet%2Ftitle&key=#{apiKey}")
			.then (response) -> response?.data?.items[0]?.snippet?.title 
		
	getVideoId: (url) ->
		regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
		match = url.match regExp
		if match && match[2].length == 11
  		match[2];
		else 
			console.log 'error: could not get videoId for ' + url

	getTrackTitle: (url) ->
		vidId = this.getVideoId url
		this.getTitle(vidId)


module.exports = youtubeClient