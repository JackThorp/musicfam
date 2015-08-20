import Ractive from 'ractive';
import html from './hello.ract';

var ractive = new Ractive({

  el: '#view',

  template: html,

  data: {name: 'jack'}

});


