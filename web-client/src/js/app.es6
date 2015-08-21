import Ractive from 'ractive';
import html from './home.ract';
import axios from 'axios';

var urls = [ {url: 'www.bla.com'}, {url: 'www.foo.co.uk'} ];

var ractive = new Ractive({

  el: '#view',

  template: html,

  data: {
    name: 'jack',
    urls: urls
  }

});

var updateURLs = () => {
  axios.get('http://localhost:3000/lists').then((res) => {
      console.log(res.data);
      ractive.set('urls', res.data);
  });
}

ractive.on('postURL', (e, url) => {
  console.log(url);
  let data = {url: url}
  axios.post('http://localhost:3000/lists', data).then(() => {
    updateURLs();
  })
});

updateURLs();

