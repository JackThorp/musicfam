import Ractive from 'ractive';
import html from './playlist.ract';
import navbar from '../navbar/navbar.ract';
import axios from 'axios';

class Playlist {

  constructor(auth, events, config) {
    this.axios    = axios;
    this.auth     = auth;
    this.events   = events;
    this.config   = config;
    this.playlist = {};
  }

  render(hash) {

    let paths = hash.split('/');
    this.id = paths[paths.length - 1];
    
    this.ractive = new Ractive({
      el: '#view',
      template: html,
      partials: {navbar: navbar},
      data: {
        user: this.auth.loggedInUser(),
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

    this.ractive.on('logout', () => this.logout());

    this.updatePlayList();

  }

  updatePlayList() {
    this.axios.get(this.config.api + '/lists/' + this.id)
      .then((res) => {
        this.playlist = res.data;
        this.ractive.set('playlist', res.data);
      });
  }

  logout() {
    this.auth.clearLogin();
    this.events.routing.transitionTo.dispatch('login', this);
  }

  unrender() {
    return this.ractive.teardown();
  }
}

export default Playlist;
