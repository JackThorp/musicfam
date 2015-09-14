import axios from 'axios';
import _ from 'lodash';

class PlaylistService {

  // Pass the domain model for playlists. 
  constructor(Playlist) {
    this.Playlist = Playlist;
  }

  find (id) {
    return this.Playlist.find(id);
  }

  findAll () {
    return this.Playlist.findAll();
  }

  // Find all playlists belonging to currently logged in user
  findPersonal (userId) {
    return this.findAll().then((playlists) => {
      return _.filter(playlists, {owner: {_id: userId}})  
    })
  }

  // Find all public playlists (those which logged in user does not own)
  findPublic (userId) {
    return this.findAll().then((playlists) => {
      return _.filter(playlists, (pl) => {
        return pl.owner._id != userId;
      })  
    })
  }

  // Create and return a new playlist.
  add (playlist) {
    playlist = new this.Playlist(playlist);
    return playlist.save ();
  }

  remove (playlist) {
    return playlist && playlist.del();
  }

  save (playlist) {
    return playlist && playlist.save();
  }
  
}

export default PlaylistService;
