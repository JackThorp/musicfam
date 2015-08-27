import Ractive from 'ractive';
import html from './home.ract';
import axios from 'axios';

class Home {

  constructor(config){
    this.axios = axios;
    this.config = config;
  }

  render(hash) {

    console.log('HASH: ' + hash);

    this.ractive = new Ractive({
      el: '#view',
      template: html,
      data: {}
    });

    
    this.ractive.on('newList', (e, name) => {
      axios.post(this.config.api + '/lists', {name: name}).then(() => {
        this.updatePlayLists();
      })
    });

    this.updatePlayLists();

  }

  updatePlayLists() {
    axios.get(this.config.api + '/lists').then((res) => {
      this.ractive.set('playLists', res.data);
    });
  }

  unrender() {
    this.ractive.teardown()
  }

}

export default Home;
