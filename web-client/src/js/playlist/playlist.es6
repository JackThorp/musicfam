import Ractive from 'ractive';
import html from './playlist.ract';
import navbar from '../navbar/navbar.ract';
import axios from 'axios';

class Playlist {

  constructor(auth, events, playlistService) {
    this.axios    = axios;
    this.auth     = auth;
    this.events   = events;
    this.playlistService = playlistService;
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
        user: this.auth.loggedInUser()
      }
    });

    // USE playlistService find - to get the cylinder for this view. 
    this.playlistService.find(this.id).then((playlist) => {
      this.playlist = playlist;
      this.ractive.set('playlist', this.playlist);
    });

    // To Add and delete tracks simply modify the playlist and call cylinderListService.save(playlist);
    this.ractive.on('newTrack', (e, url) => {
      this.playlist.tracks.push({url:url});
      this.playlistService.save(this.playlist);
    });

    this.ractive.on('deleteTrack', (e, index) => {
      this.playlist.tracks.splice(index,1);
      this.playlistService.save(this.playlist);
    });

    this.ractive.on('logout', () => this.logout());

  }

  isProtected(){
    return true;
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
