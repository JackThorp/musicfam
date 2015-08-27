import Ractive from 'ractive';
import Router from './services/router.es6';

import Home from './home/home.es6';

let router = new Router();

router.addRoute('home', new Home());

router.initialise();
