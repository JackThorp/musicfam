import Ractive  from 'ractive';
import Logdown  from 'logdown';
import axios    from 'axios';
import Parsley  from 'parsleyjs';

import Router   from './services/router.es6';
import events   from './services/events.es6';
import Auth     from './services/auth.es6';
import storage  from './services/storage.es6';

import parsleyDecorator  from './services/parsley-decorator.es6'; 
Ractive.decorators.parsley = parsleyDecorator;

import Home     from './home/home.es6';
import Playlist from './playlist/playlist.es6';
import Login    from './login/login.es6';
import NotFound from './404/404.es6';

import config   from 'configuration';

let logger  = new Logdown({prefix: 'app'});
let auth    = new Auth(axios, storage, events, config);
let router  = new Router(auth, events);

// Interceptors allow us to change headers before request is sent.
axios.interceptors.request.use(function(config) {
  let accessToken = storage.local.get('accessToken');
  if(accessToken) config.headers['X-Auth-Token'] = accessToken;
  else delete config.headers['X-Auth-Token'];
  return config;
});

router.addRoute('login', new Login(auth, events));
router.addRoute('home', new Home(auth, events, config));
router.addRoute('playlist/{id}', new Playlist(config));
router.addRoute('404', new NotFound());

// First thing on page load (before trying to route to the current hash) is to establish if the user
// is logged in, and if not, whether they should be directed somewhere else first.
auth.restoreLogin().then(function() {

  // After login has been restored we can initialise routing. This will cause the router
  // to load the page corresponding to the current route.
  // Initialisng the router after authentication means:
  // a) we can cleanly check that the user is authenticated for the page
  // b) the restored login handler can transition to any appropriate pages BEFORE the router
  //    initialises and starts to auto load whatever location the app might be at.
  router.initialise();
});

// Event is fired after auth service has attempted to log in.
events.auth.restoredLogin.add(function(err, user) {

  if(err && err.status === 401) {
    logger.warn('A failed log in attempt has been made');
    return router.transitionTo('login');
  }

  if(err) {
    logger.warn('connection to the api has been lost');
    return router.transitionTo('sorry');
  }

  // If no error (the user is logged) then the router will automatically load the page
  // associated with the current hash/fragment when it initialises.
  logger.log('the login credentials have been restored');
});

events.routing.accessDenied.add(function(path) {
  
  logger.warn('access to ' + path + ' has been denied');
  return router.transitionTo('login');
});

events.routing.notFound.add(function() {
  logger.log('the entered path could not be found');
  return router.transitionTo('404');
});

events.routing.transitionTo.add(function(path, view) {
  logger.log('transitioning to ' + path);
  view.unrender().then(function(){
    router.transitionTo(path);
  });
});
