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
      return axios.get(config.api + '/lists/' + id)
        .then(Playlist.mapPlaylist);
  }



  // Retreive all playlists from the API and map to damain model.
  static findAll() {
    return axios.get(config.api + '/lists')
      .then(Playlist.mapPlaylists);
  }


  // TODO different sematics for saving new list
  // which is a post. And saving an existing list which is a put
  // Arguably one should be static and one should by dynamic??
  save() {
    if(!this.name) {
      return null;
    }

    console.log('oo');
    return axios.post(config.api + '/lists', this)
      .then(Playlist.mapPlaylist, (err) => console.log(err));
  }



  del() {
    return axios.delete(config.api + '/lists/' + this._id);
  }
}

export default Playlist;
