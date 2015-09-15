sockets =

	setSocket: (io) ->
		io.on 'connection', (socket) ->
			console.log 'client connected'
		this.io = io

	newList: (pl) ->
		this.io.emit 'new-playlist', pl

	deletedList: (pl) ->
		this.io.emit 'del-playlist', pl


module.exports = sockets;