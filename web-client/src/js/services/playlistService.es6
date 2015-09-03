import axios from 'axios';

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
