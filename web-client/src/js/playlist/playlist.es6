import Ractive from 'ractive';
import html from './playlist.ract';
import axios from 'axios';

class Playlist {

  constructor(config) {
    this.axios    = axios;
    this.config   = config;
    this.playlist = {};
  }

  render(hash) {

    let paths = hash.split('/');
    this.id = paths[paths.length - 1];
    
    this.ractive = new Ractive({
      el: '#view',
      template: html,
      data: {
        playlist: this.playlist
      }
    });

    this.ractive.on('newTrack', (e, url) => {
      this.playlist.tracks.push({url:url});
      this.axios.put(this.config.api + '/lists/' + this.id, this.playlist)
    });

    this.ractive.on('deleteTrack', (e, index) => {
      this.playlist.tracks.splice(index,1);
      this.axios.put(this.config.api + '/lists/' + this.id, this.playlist)
    });

    this.updatePlayList();

  }

  updatePlayList() {
    this.axios.get(this.config.api + '/lists/' + this.id)
      .then((res) => {
        console.log(res.data);
        this.playlist = res.data;
        this.ractive.set('playlist', res.data);
      });
  }


  unrender() {
    this.ractive.teardown();
  }
}

export default Playlist;
