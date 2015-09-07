import PlaylistService 	from '../../../src/js/services/playlistService.es6'
import Playlist 		from '../../../src/js/models/playlist.es6'

import _ from 'lodash'
import Promise from 'bluebird'

describe('playlistService', function() {

	let plService = {}
	let userId = '1234';
	let allPLs = [{
		name: 'l1', 
		tracks: [], 
		ownerID: userId
	}, {
		name: 'l2', 
		tracks: [], 
		ownerID: 5678
	}, {
		name: 'l3', 
		tracks: [], 
		ownerID: userId
	}]

	beforeEach(function(done) {
		plService = new PlaylistService(Playlist)
		spyOn(Playlist, "findAll").and.returnValue(Promise.resolve(allPLs));
		done();
	})

	describe('Personal playlists', function() {

		it('should only contain playlists owned by the logged in user', function(done) {
			plService.findPersonal(userId).then((personalPls) => {
				expect(Playlist.findAll).toHaveBeenCalled();
				
				let filteredPLs = _.filter(personalPls, {ownerID: userId})
				expect(filteredPLs.length).toEqual(personalPls.length);
				done();
			})
			
		})

		it('should contain all the playlists owned by the logged in user', function(done) {
			plService.findPersonal(userId).then((personalPls) => {
				expect(Playlist.findAll).toHaveBeenCalled();
				expect(personalPls.length).toEqual(2)
				expect(_.find(personalPls, {name: 'l1'})).toBeDefined()
				expect(_.find(personalPls, {name: 'l3'})).toBeDefined()
				done();
			})
		})
	})

	describe('Public playlists', function() {

		it('should not contain any playlists owned by logged in user', function(done) {
			plService.findPublic(userId).then((publicPls) => {
				expect(publicPls.length).toEqual(1);
				done();	
			})
		})

	})

})