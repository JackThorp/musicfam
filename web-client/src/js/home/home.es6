import Ractive from 'ractive';
import html from './home.ract';
import storage from '../services/storage.es6';
import axios from 'axios';

class Home {

  constructor(auth, events, config){
    this.axios  = axios;
    this.auth   = auth;
    this.events = events;
    this.config = config;
  }

  render(hash) {

    let loggedInUser = storage.memory.get('user'); 
    this.ractive = new Ractive({
      el: '#view',
      template: html,
      data: {
        user: loggedInUser
      }
    });

    
    this.ractive.on('newList', (e, name) => {
      axios.post(this.config.api + '/lists', {name: name}).then(() => {
        this.updatePlayLists();
      })
    });

    this.updatePlayLists();

  }

  isProtected() {
    return true;
  }

  updatePlayLists() {
    axios.get(this.config.api + '/lists').then((res) => {
      this.ractive.set('playLists', res.data);
    });
  }

  unrender() {
    return this.ractive.teardown()
  }

}

export default Home;
