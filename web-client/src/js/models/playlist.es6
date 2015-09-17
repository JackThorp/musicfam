import axios  from 'axios'
import _      from 'lodash'
import config from 'configuration'

class Playlist {

  constructor(playlist) {
    _.extend (this, playlist);
  }

  static mapPlaylist (response) {
    if (response && response.data) {
      return new Playlist(response.data);
    }
    return {};
  }



  // Maps the response data from the api to this augmented 
  // front end domain model.
  static mapPlaylists (response) {
    if (response && response.data) {
      return _.map (response.data, (playlist) => {
        return new Playlist (playlist);
      });
    }
    return [];
  }



  static find(id) {
      return axios.get(config.api + '/playlists/' + id)
        .then(Playlist.mapPlaylist);
  }



  // Retreive all playlists from the API and map to damain model.
  static findAll() {
    return axios.get(config.api + '/playlists')
      .then(Playlist.mapPlaylists);
  }

  save() {
    if(!this.name) {
      return null;
    }

    // Future fix would be to attach update links to resources in backend for more
    // RESTful behaviour.
    if(this._id) {
      return axios.put(config.api + this._links.self.href, this)
        .then(Playlist.mapPlaylist, (err) => console.log(err));
    }

    return axios.post(config.api + '/playlists', this)
      .then(Playlist.mapPlaylist, (err) => console.log(err));
  }

  del() {
    return axios.delete(config.api + this._links.self.href);
  }
}

export default Playlist;
