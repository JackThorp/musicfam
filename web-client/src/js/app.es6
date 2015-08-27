import Ractive from 'ractive';
import Router from './services/router.es6';

import Home     from './home/home.es6';
import Playlist from './playlist/playlist.es6';
import config   from 'configuration';

let router = new Router();

router.addRoute('home', new Home(config));
router.addRoute('playlist/{id}', new Playlist(config));

router.initialise();
