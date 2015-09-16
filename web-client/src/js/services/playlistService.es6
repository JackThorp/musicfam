import axios from 'axios';
import _ from 'lodash';

class PlaylistService {

  // Pass the domain model for playlists. 
  constructor(Playlist) {
    this.Playlist = Playlist;
  }

  find (id, uid) {
    return this.Playlist.find(id).then((playlist) => {
      return this.setPermissions(playlist, uid)
    });
  }

  findAll (uid) {
    return this.Playlist.findAll().then((playlists) => {
      return _.map(playlists, (pl) => {
        return this.setPermissions(pl, uid)
      })  
    });
  }

  setPermissions(pl, uid){
    if(pl.owner._id == uid) {
      pl.isOwner = true
    }
    if(_.find(pl.editors, {_id: uid})) {
      pl.isEditor = true
    }
    return pl
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
