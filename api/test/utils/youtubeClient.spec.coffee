expect		= require('chai').expect 		
ytClient 	= require '../../src/utils/youtubeClient.coffee'

describe 'youtubeClient utility', ->

	describe 'getting track name from youtube API given the videoId', ->

		it 'should return correct title given a valid youtube video ID', (done) ->

			# Check this is still a valid youtube video when debugging test. 
			ninaSimeoneBaltimoreID = 'fC20nRg4ptQ'
			ytClient
				.getTitle(ninaSimeoneBaltimoreID)
				.then((title) -> expect(title).to.equal 'Nina Simone - Baltimore - 01 Baltimore'; done())
				.catch((err) -> done err)


	describe 'retreving videoId from URL', ->

		it 'should work for URLs of form: www.youtube.com/watch?v=fC20nRg4ptQ', (done) ->

			vidId = ytClient.getVideoId 'https://www.youtube.com/watch?v=fC20nRg4ptQ'
			expect(vidId).to.equal 'fC20nRg4ptQ'
			done()


	describe 'getting title from URL', ->

		it 'should return a correct title given a youtube URL', (done) ->

			ytClient
				.getTrackTitle('https://www.youtube.com/watch?v=jK680uD7qQI&index=1&list=PLpaw6RtD8L6LExZLP0PG89UJZDNMkwIvq')
				.then((title) -> expect(title).to.equal 'Fatoumata Diawara - Sowa (Official)'; done())
				.catch((err) -> done err)
