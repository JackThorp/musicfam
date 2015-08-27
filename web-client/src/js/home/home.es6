import Ractive from 'ractive';
import html from './home.ract';
import axios from 'axios';

class Home {

  constructor(){
    this.axios = axios;
    console.log('constructing home!')
  }

  render(){
    console.log('rendering home!')
    this.ractive = new Ractive({
      el: '#view',
      template: html,
      data: {
        name: 'jack'
      }
    });

    
    this.ractive.on('newList', (e, name) => {
      axios.post('http://localhost:3000/api/lists', {name: name}).then(() => {
        this.updatePlayLists();
      })
    });

    this.updatePlayLists();

  }

  updatePlayLists() {
    axios.get('http://localhost:3000/api/lists').then((res) => {
      this.ractive.set('playLists', res.data);
    });
  }

  unrender() {
    this.ractive.teardown()
  }

}

export default Home;
