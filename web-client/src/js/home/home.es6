import Ractive from 'ractive';
import html from './home.ract';
import navbar from '../navbar/navbar.ract';
import _ from 'lodash'

class Home {

  constructor(auth, events, playlistService, socket){
    this.auth   = auth;
    this.events = events;
    this.playlists = [];
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
        searchTerm: ''
      }
    });


    // Filter out users to add as collaborators based on the search term
    this.ractive.observe( 'searchTerm', (newValue) => {
      
      if(newValue.length == 0) {
        this.playlists.forEach(function(pl){pl.dontShow = false});
        return this.ractive.set('playlists', this.playlists);
      } 
      
      this.playlists.forEach(function(pl) {
        pl.dontShow = !_.contains(pl.name.toLowerCase(), newValue.toLowerCase())
      })
      
      return this.ractive.set('playlists', this.playlists);
    });


    this.ractive.on('addPlaylist', (e, name) => {
      this.playlistService.add({name});
    });

    this.ractive.on('delPlaylist', (e, playlist) => {
      this.playlistService.remove(playlist);
    });

    this.ractive.on('logout', () => this.logout()); 

    this.socket.on('saved-playlist', (pl) => this.changedPlaylist(pl));
    this.socket.on('del-playlist', (pl) => this.deletePlaylist(pl));

    if(this.loggedInUser && this.loggedInUser._id) {
      this.playlistService.findAll(this.loggedInUser._id).then((playlists) => {
        this.playlists = playlists;
        this.ractive.set('playlists', this.playlists);
      });  
    } 
    

  }

  changedPlaylist(pl) {
    this.playlistService.find(pl._id, this.loggedInUser._id).then((fullPl) => { 
      let thisPl = _.find(this.playlists, {_id: pl._id})
      
      // If the playlist already exists it must be removed. (otherwise it is new)
      if(thisPl) {
        this.playlists.splice(_.indexOf(thisPl), 1)
      }
      this.playlists.push(fullPl)
    })
  }

  deletePlaylist(pl) {
    let index = _.indexOf(_.find(this.playlists, {_id: pl._id}))
    this.playlists.splice(index,1);
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
