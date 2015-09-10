import Ractive from 'ractive';
import html from './home.ract';
import navbar from '../navbar/navbar.ract';

class Home {

  constructor(auth, events, playlistService){
    this.auth   = auth;
    this.events = events;
    this.personalPlaylists = [];
    this.publicPlaylists = [];
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
        this.personalPlaylists.push(playlist);
      });
    });


    this.ractive.on('removeList', (e, list, index) => {
      this.playlistService.remove(list);
      this.personalPlaylists.splice(index,1);
    });


    this.ractive.on('logout', () => this.logout()); 


    this.playlistService.findPublic(loggedInUser._id).then((publicPlaylists) => {
      this.publicPlaylists = publicPlaylists;
      this.ractive.set('publicPlaylists', this.publicPlaylists);
    });


    this.playlistService.findPersonal(loggedInUser._id).then((playlists) => {
      // ractive.update only works with modification like ar[3] = n. not like ar = [];
      this.personalPlaylists = playlists;
      this.ractive.set('personalPlaylists', this.personalPlaylists);
    })

  }

  logout() {
    this.auth.clearLogin();
    this.events.routing.transitionTo.dispatch('login', this);
  }

  isProtected() {
    return true;
  }

  unrender() {
    return this.ractive.teardown()
  }

}

export default Home;
