import Ractive  from 'ractive';
import html     from './playlist.ract';
import navbar   from '../navbar/navbar.ract';
import axios    from 'axios';
import _        from 'lodash'

class Playlist {

  constructor(auth, events, playlistService, userService) {
    this.axios    = axios;
    this.auth     = auth;
    this.events   = events;
    this.playlistService = playlistService;
    this.userService  = userService;
    this.playlist = {};
  }

  render(hash) {

    let paths = hash.split('/');
    this.id = paths[paths.length - 1];
    this.loggedInUser = this.auth.loggedInUser();

    this.ractive = new Ractive({
      el: '#view',
      template: html,
      partials: {navbar: navbar},
      data: {
        searchTerm: '',
        user: this.auth.loggedInUser(),
        users: []
      }
    });
    
    // Filter out users to add as collaborators based on the search term
    this.ractive.observe( 'searchTerm', ( newValue, oldValue ) => {
      
      if(newValue.length == 0) {
        return this.ractive.set('addEditorList', [])
      } 
      
      let filtered = this.users.filter((user) => { 

        // Can't add someone who is already an editor.
        let alreadyEditor = this.playlist.editors.some((editor) => {
          return user._id == editor._id
        })

        // Can't add yourself or someone who is already an editor
        if(alreadyEditor || user._id == this.loggedInUser._id) return false;

        // User name must match search query
        return _.contains(user.username, newValue)

      })
  
      this.ractive.set('addEditorList', filtered)
    });

    // Get user list and save locally.
    this.userService.findAll().then((users) => {
      this.users = users;
      this.ractive.set('users', this.users);
    })

    // USE playlistService find - to get the playlists for this view. 
    this.playlistService.find(this.id).then((playlist) => {

      console.log(playlist)
      let editPermissions = this.loggedInUser._id == playlist.owner._id || 
        playlist.editors.some((editor) => {return editor._id == this.loggedInUser._id})

      this.ractive.set('editPermissions', editPermissions);
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


    this.ractive.on('addEditor', (e, user) => {
      this.playlist.editors.push(user)
      this.playlistService.save(this.playlist)
    })

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
