import Ractive from 'ractive';
import html from './home.ract';
import navbar from '../navbar/navbar.ract';
import _ from 'lodash'

class Home {

  constructor(auth, events, playlistService, socket){
    this.auth   = auth;
    this.events = events;
    this.personalPlaylists = [];
    this.publicPlaylists = [];
    this.playlistService = playlistService;
    this.socket = socket;
  }

  render(hash) {

    this.loggedInUser = this.auth.loggedInUser(); 
    this.ractive = new Ractive({
      el: '#view',
      template: html,
      partials: {navbar: navbar},
      data: {
        user: this.loggedInUser,
        isEditor: function(pl) {
          return false
          for(var i = 0; i < pl.editors.length; i++){
            if(pl.editors[i]._id == user._id) {
              return true
            }
          }
          return false
        }
      }
    });


    this.ractive.on('newList', (e, name) => {
      this.playlistService.add({name}).then((playlist) => {
        // Ractive intercepts push method by default
        console.log(playlist)
        this.personalPlaylists.push(playlist);
      });
    });


    this.ractive.on('removeList', (e, list, index) => {
      this.playlistService.remove(list);
      this.personalPlaylists.splice(index,1);
    });


    this.ractive.on('logout', () => this.logout()); 

    this.setPrivatePlaylists();
    this.setPublicPlaylists();

    this.socket.on('new-playlist', (pl) => this.updateAfterPlaylistChange(pl));
    this.socket.on('del-playlist', (pl) => this.updateAfterPlaylistChange(pl));

  }

  updateAfterPlaylistChange(pl) {
    if(pl.owner._id != this.loggedInUser._id) {
      this.setPublicPlaylists();
    }
  }

  setPrivatePlaylists() {
    this.playlistService.findPersonal(this.loggedInUser._id).then((playlists) => {
      // ractive.update only works with modification like ar[3] = n. not like ar = [];
      this.personalPlaylists = playlists;
      this.ractive.set('personalPlaylists', this.personalPlaylists);
    })    
  }

  setPublicPlaylists() {
    this.playlistService.findPublic(this.loggedInUser._id).then((publicPlaylists) => {
      this.publicPlaylists = publicPlaylists;
      this.ractive.set('publicPlaylists', this.publicPlaylists);
    });
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
