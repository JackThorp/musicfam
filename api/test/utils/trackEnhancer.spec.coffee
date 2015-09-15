expect		= require('chai').expect 		
_					= require 'lodash'
trackEnhancer	= require '../../src/utils/trackEnhancer'


urlList = [{url: 'https://www.youtube.com/watch?v=w_nVJ9ZMrGU'}, {url: 'https://www.notYouTube.com/watch?v=rubbish'}]

describe 'trackEnhancer utility', ->

	describe 'returned tracks array', ->

		it 'should be the same length as passed', (done) ->
			trackEnhancer
				.getTrackInfo(urlList)
				.then((tracks) ->
					expect(tracks.length).to.equal urlList.length
					done())
				.catch done


		it 'should have titles for tracks with valid URLs', (done) ->
			trackEnhancer
				.getTrackInfo(urlList)
				.then((tracks) ->
					validTrack = _.find(tracks, urlList[0])
					expect(validTrack.title).to.be.ok
					# If test fails check that video still extists - URL might be dead
					expect(validTrack.title).to.equal 'OLD SCHOOL DEEP HOUSE MIX'
					done())
				.catch done
			

		it 'should have source information for tracks with a title', (done) ->
			done()

		it 'should have a trackId', (done) ->
			done()