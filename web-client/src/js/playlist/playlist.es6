import Ractive  from 'ractive';
import html     from './playlist.ract';
import navbar   from '../navbar/navbar.ract';
import axios    from 'axios';
import _        from 'lodash'

class Playlist {

  constructor(auth, events, playlistService, userService, socket) {
    this.axios    = axios;
    this.auth     = auth;
    this.events   = events;
    this.socket   = socket;
    this.playlistService = playlistService;
    this.userService  = userService;
    this.player   = {};
    this.playlist = {};
    this.currentVid = 0
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
      this.ractive.set('searchTerm', '')
    })

    this.ractive.on('shuffle', (e) => {
      this.shuffle(this.playlist.tracks)
    })

    this.ractive.on('playTrack', (e, index) => {this.currentVid = index; this.playNext()})
    this.ractive.on('playNext', (e) => { this.playNext() })
    this.ractive.on('playLast', (e) => { 
      this.currentVid = Math.max(this.currentVid-=2, 0);
      this.playNext(); 
    })

    this.ractive.on('logout', () => this.logout());

    this.socket.on('saved-playlist', (pl) => this.savedPlaylist(pl))
    this.socket.on('del-playlist', (pl) => console.log('go to sorry page'));

    this.getPlaylist(this.id);

    let readyInt = setInterval(() => {
      let self = this;
      if(YT) {
        this.player = new YT.Player('player', {
          height: '293',
          width: '480',
          events: {
            'onReady': function(event) {
              event.target.playVideo();
              self.playNext();          
            },
            'onStateChange': function(event) {
              if (event.data == YT.PlayerState.ENDED) {
                self.playNext();
              } 
            }
          }
        });
        clearInterval(readyInt);
      }
    }, 500);

  }

  playNext() {
    this.player.cueVideoById(this.playlist.tracks[this.currentVid].videoId)
    this.player.playVideo();
    this.currentVid++;
  }

  shuffle() {
    var currentIndex = this.playlist.tracks.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = this.playlist.tracks[currentIndex];
      this.playlist.tracks[currentIndex] = this.playlist.tracks[randomIndex];
      this.playlist.tracks[randomIndex] = temporaryValue;
    }

    this.ractive.set('playlist', this.playlist)
    this.currentVid = 0;
    this.playNext()

  }

  savedPlaylist(pl) {
    if(pl._id == this.playlist._id) {
      this.getPlaylist(pl._id);
    }
  }

  getPlaylist(id) {
    this.playlistService.find(id, this.loggedInUser._id).then((playlist) => {
      console.log(playlist)
      this.playlist = playlist;
      this.ractive.set('playlist', this.playlist);
    });
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
