import Ractive from 'ractive';
import html from './home.ract';
import navbar from '../navbar/navbar.ract';

class Home {

  constructor(auth, events, playlistService){
    this.auth   = auth;
    this.events = events;
    this.playlists = [{name:'bob'}];
    this.playlistService = playlistService;
  }

  render(hash) {

    let loggedInUser = this.auth.loggedInUser(); 
    this.ractive = new Ractive({
      el: '#view',
      template: html,
      partials: {navbar: navbar},
      data: {
        user: loggedInUser
      }
    });



    this.ractive.on('newList', (e, name) => {
      this.playlistService.add({name}).then((playlist) => {
        // Ractive intercepts push method by default
        this.playlists.push(playlist);
      });
    });



    this.ractive.on('removeList', (e, list, index) => {
      this.playlistService.remove(list);
      this.playlists.splice(index,1);
    });



    this.ractive.on('logout', () => this.logout()); 



    this.playlistService.findAll().then((playlists) => {
      // unfortunately ractive update only works when you modify an array like ar[3] = n
      // not when you reassign to the array like ar = [];
      this.playlists = playlists;
      this.ractive.set('playlists', this.playlists);
    });

  }

  logout() {
    this.auth.clearLogin();
    this.events.routing.transitionTo.dispatch('login', this);
  }

  isProtected() {
    return true;
  }

  updatePlaylists() {
    this.ractive.set('playlists', this.playlists );
  }

  unrender() {
    return this.ractive.teardown()
  }

}

export default Home;
