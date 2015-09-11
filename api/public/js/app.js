require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ractive = require('ractive');

var _ractive2 = _interopRequireDefault(_ractive);

var _ract = require('./404.ract');

var _ract2 = _interopRequireDefault(_ract);

var NotFound = (function () {
  function NotFound() {
    _classCallCheck(this, NotFound);
  }

  _createClass(NotFound, [{
    key: 'render',
    value: function render() {
      this.ractive = new _ractive2['default']({
        el: '#view',
        template: _ract2['default']
      });
    }
  }, {
    key: 'isProtected',
    value: function isProtected() {
      return false;
    }
  }, {
    key: 'unrender',
    value: function unrender() {
      return this.ractive.teardown();
    }
  }]);

  return NotFound;
})();

exports['default'] = NotFound;
module.exports = exports['default'];

},{"./404.ract":2,"ractive":"ractive"}],2:[function(require,module,exports){
module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"container"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-xs-12"},"f":[{"t":7,"e":"h1","f":["404 page not found"]}]}]}]}]}
},{}],3:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ractive = require('ractive');

var _ractive2 = _interopRequireDefault(_ractive);

var _logdown = require('logdown');

var _logdown2 = _interopRequireDefault(_logdown);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _parsleyjs = require('parsleyjs');

var _parsleyjs2 = _interopRequireDefault(_parsleyjs);

// S suffix for SERVICES

var _servicesRouterEs6 = require('./services/router.es6');

var _servicesRouterEs62 = _interopRequireDefault(_servicesRouterEs6);

var _servicesEventsEs6 = require('./services/events.es6');

var _servicesEventsEs62 = _interopRequireDefault(_servicesEventsEs6);

var _servicesAuthEs6 = require('./services/auth.es6');

var _servicesAuthEs62 = _interopRequireDefault(_servicesAuthEs6);

var _servicesStorageEs6 = require('./services/storage.es6');

var _servicesStorageEs62 = _interopRequireDefault(_servicesStorageEs6);

var _servicesPlaylistServiceEs6 = require('./services/playlistService.es6');

var _servicesPlaylistServiceEs62 = _interopRequireDefault(_servicesPlaylistServiceEs6);

var _servicesUserServiceEs6 = require('./services/userService.es6');

var _servicesUserServiceEs62 = _interopRequireDefault(_servicesUserServiceEs6);

var _servicesParsleyDecoratorEs6 = require('./services/parsley-decorator.es6');

var _servicesParsleyDecoratorEs62 = _interopRequireDefault(_servicesParsleyDecoratorEs6);

// Models

var _modelsPlaylistEs6 = require('./models/playlist.es6');

var _modelsPlaylistEs62 = _interopRequireDefault(_modelsPlaylistEs6);

var _modelsUserEs6 = require('./models/user.es6');

var _modelsUserEs62 = _interopRequireDefault(_modelsUserEs6);

// C suffix for CONTROLLERS

var _homeHomeEs6 = require('./home/home.es6');

var _homeHomeEs62 = _interopRequireDefault(_homeHomeEs6);

var _playlistPlaylistEs6 = require('./playlist/playlist.es6');

var _playlistPlaylistEs62 = _interopRequireDefault(_playlistPlaylistEs6);

var _loginLoginEs6 = require('./login/login.es6');

var _loginLoginEs62 = _interopRequireDefault(_loginLoginEs6);

var _es6 = require('./404/404.es6');

var _es62 = _interopRequireDefault(_es6);

var _configuration = require('configuration');

var _configuration2 = _interopRequireDefault(_configuration);

_ractive2['default'].decorators.parsley = _servicesParsleyDecoratorEs62['default'];

var logger = new _logdown2['default']({ prefix: 'app' });
var auth = new _servicesAuthEs62['default'](_axios2['default'], _servicesStorageEs62['default'], _servicesEventsEs62['default'], _configuration2['default']);
var router = new _servicesRouterEs62['default'](auth, _servicesEventsEs62['default']);

var plService = new _servicesPlaylistServiceEs62['default'](_modelsPlaylistEs62['default']);
var uService = new _servicesUserServiceEs62['default'](_modelsUserEs62['default']);

// Interceptors allow us to change headers before request is sent.
_axios2['default'].interceptors.request.use(function (config) {
  var accessToken = _servicesStorageEs62['default'].local.get('accessToken');
  if (accessToken) config.headers['X-Auth-Token'] = accessToken;else delete config.headers['X-Auth-Token'];
  return config;
});

router.addRoute('login', new _loginLoginEs62['default'](auth, _servicesEventsEs62['default']));
router.addRoute('home', new _homeHomeEs62['default'](auth, _servicesEventsEs62['default'], plService));
router.addRoute('playlist/{id}', new _playlistPlaylistEs62['default'](auth, _servicesEventsEs62['default'], plService, uService));
router.addRoute('404', new _es62['default']());

// First thing on page load (before trying to route to the current hash) is to establish if the user
// is logged in, and if not, whether they should be directed somewhere else first.
console.log('wooooo');
auth.restoreLogin().then(function () {

  // After login has been restored we can initialise routing. This will cause the router
  // to load the page corresponding to the current route.
  // Initialisng the router after authentication means:
  // a) we can cleanly check that the user is authenticated for the page
  // b) the restored login handler can transition to any appropriate pages BEFORE the router
  //    initialises and starts to auto load whatever location the app might be at.
  router.initialise();
});

// Event is fired after auth service has attempted to log in.
_servicesEventsEs62['default'].auth.restoredLogin.add(function (err, user) {

  if (err && err.status === 401) {
    logger.warn('A failed log in attempt has been made');
    return router.transitionTo('login');
  }

  if (err) {
    logger.warn('connection to the api has been lost');
    return router.transitionTo('sorry');
  }

  // If no error (the user is logged) then the router will automatically load the page
  // associated with the current hash/fragment when it initialises.
  logger.log('the login credentials have been restored');
});

_servicesEventsEs62['default'].routing.accessDenied.add(function (path) {

  logger.warn('access to ' + path + ' has been denied');
  return router.transitionTo('login');
});

_servicesEventsEs62['default'].routing.notFound.add(function () {
  logger.log('the entered path could not be found');
  return router.transitionTo('404');
});

_servicesEventsEs62['default'].routing.transitionTo.add(function (path, view) {
  logger.log('transitioning to ' + path);
  view.unrender().then(function () {
    router.transitionTo(path);
  });
});

},{"./404/404.es6":1,"./home/home.es6":4,"./login/login.es6":6,"./models/playlist.es6":8,"./models/user.es6":9,"./playlist/playlist.es6":11,"./services/auth.es6":13,"./services/events.es6":14,"./services/parsley-decorator.es6":15,"./services/playlistService.es6":16,"./services/router.es6":17,"./services/storage.es6":18,"./services/userService.es6":19,"axios":"axios","configuration":"configuration","logdown":"logdown","parsleyjs":"parsleyjs","ractive":"ractive"}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ractive = require('ractive');

var _ractive2 = _interopRequireDefault(_ractive);

var _homeRact = require('./home.ract');

var _homeRact2 = _interopRequireDefault(_homeRact);

var _navbarNavbarRact = require('../navbar/navbar.ract');

var _navbarNavbarRact2 = _interopRequireDefault(_navbarNavbarRact);

var Home = (function () {
  function Home(auth, events, playlistService) {
    _classCallCheck(this, Home);

    this.auth = auth;
    this.events = events;
    this.personalPlaylists = [];
    this.publicPlaylists = [];
    this.playlistService = playlistService;
  }

  _createClass(Home, [{
    key: 'render',
    value: function render(hash) {
      var _this = this;

      var loggedInUser = this.auth.loggedInUser();
      this.ractive = new _ractive2['default']({
        el: '#view',
        template: _homeRact2['default'],
        partials: { navbar: _navbarNavbarRact2['default'] },
        data: {
          user: loggedInUser
        }
      });

      this.ractive.on('newList', function (e, name) {
        _this.playlistService.add({ name: name }).then(function (playlist) {
          // Ractive intercepts push method by default
          _this.personalPlaylists.push(playlist);
        });
      });

      this.ractive.on('removeList', function (e, list, index) {
        _this.playlistService.remove(list);
        _this.personalPlaylists.splice(index, 1);
      });

      this.ractive.on('logout', function () {
        return _this.logout();
      });

      this.playlistService.findPublic(loggedInUser._id).then(function (publicPlaylists) {
        _this.publicPlaylists = publicPlaylists;
        _this.ractive.set('publicPlaylists', _this.publicPlaylists);
      });

      this.playlistService.findPersonal(loggedInUser._id).then(function (playlists) {
        // ractive.update only works with modification like ar[3] = n. not like ar = [];
        _this.personalPlaylists = playlists;
        _this.ractive.set('personalPlaylists', _this.personalPlaylists);
      });
    }
  }, {
    key: 'logout',
    value: function logout() {
      this.auth.clearLogin();
      this.events.routing.transitionTo.dispatch('login', this);
    }
  }, {
    key: 'isProtected',
    value: function isProtected() {
      return true;
    }
  }, {
    key: 'unrender',
    value: function unrender() {
      return this.ractive.teardown();
    }
  }]);

  return Home;
})();

exports['default'] = Home;
module.exports = exports['default'];

},{"../navbar/navbar.ract":10,"./home.ract":5,"ractive":"ractive"}],5:[function(require,module,exports){
module.exports={"v":3,"t":[{"t":8,"r":"navbar"}," ",{"t":7,"e":"div","a":{"class":"container"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-xs-12"},"f":[{"t":7,"e":"h3","f":["Your playlists"]}," ",{"t":7,"e":"table","a":{"class":"table"},"f":[{"t":7,"e":"thead","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th","f":["Name"]}," ",{"t":7,"e":"th"}]}]}," ",{"t":7,"e":"tbody","f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"a","a":{"href":["#/playlist/",{"t":2,"r":"_id"}]},"f":[{"t":2,"r":"name"}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","a":{"aria-hidden":"true","class":"glyphicon glyphicon-trash pull-right"},"v":{"click":{"n":"removeList","d":[{"t":2,"r":"."},",",{"t":2,"r":"num"}]}}}]}]}],"n":52,"i":"num","r":"personalPlaylists"}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"input","a":{"type":"text","placeholder":"new list","value":[{"t":2,"r":"newListName"}],"class":"form-control"}}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"button","a":{"type":"submit","class":"btn btn-block btn-success center-block"},"v":{"click":{"n":"newList","d":[{"t":2,"r":"newListName"}]}},"f":["Add"]}]}]}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-xs-12"},"f":[{"t":7,"e":"h3","f":["Playlists by others"]}," ",{"t":7,"e":"table","a":{"class":"table"},"f":[{"t":7,"e":"thead","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th","f":["Name"]}]}]}," ",{"t":7,"e":"tbody","f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"a","a":{"href":["#/playlist/",{"t":2,"r":"_id"}]},"f":[{"t":2,"r":"name"}]}]}]}],"n":52,"i":"num","r":"publicPlaylists"}]}]}]}]}]}]}
},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ractive = require('ractive');

var _ractive2 = _interopRequireDefault(_ractive);

var _loginRact = require('./login.ract');

var _loginRact2 = _interopRequireDefault(_loginRact);

var Login = (function () {
  function Login(auth, events) {
    _classCallCheck(this, Login);

    this.auth = auth;
    this.events = events;
  }

  _createClass(Login, [{
    key: 'render',
    value: function render() {
      var _this = this;

      this.ractive = new _ractive2['default']({
        el: '#view',
        template: _loginRact2['default'],
        data: {
          showError: false
        }
      });

      this.ractive.on('signIn', function () {
        var username = _this.ractive.get('username');
        var password = _this.ractive.get('password');
        _this.signIn(username, password);
      });
    }
  }, {
    key: 'signIn',
    value: function signIn(username, password) {
      var _this2 = this;

      this.auth.login(username, password).then(function (user) {
        return _this2.goToHomeScreen();
      }, function (err) {
        return _this2.showError(err);
      });
    }
  }, {
    key: 'showError',
    value: function showError(err) {
      this.ractive.set('showError', true);
    }
  }, {
    key: 'goToHomeScreen',
    value: function goToHomeScreen() {
      this.events.routing.transitionTo.dispatch('home', this);
    }
  }, {
    key: 'isProtected',
    value: function isProtected() {
      return false;
    }
  }, {
    key: 'unrender',
    value: function unrender() {
      return this.ractive.teardown();
    }
  }]);

  return Login;
})();

exports['default'] = Login;
module.exports = exports['default'];

},{"./login.ract":7,"ractive":"ractive"}],7:[function(require,module,exports){
module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"container"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"style":"padding: 50px 0;","class":"col-xs-6 col-xs-offset-3"},"f":[{"t":7,"e":"h1","a":{"style":"text-align:center;"},"f":["elcome To Playlist"]}," ",{"t":7,"e":"h4","a":{"style":"text-align:center;"},"f":["COLLABORATIVE - PLAYLISTS - ONLINE"]}]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-xs-6 col-xs-offset-3"},"f":[{"t":7,"e":"form","f":[{"t":7,"e":"div","a":{"class":"form-group"},"f":[{"t":7,"e":"input","a":{"value":[{"t":2,"r":"username"}],"type":"username","id":"exampleInputEmail1","placeholder":"Username","class":"form-control"}}]}," ",{"t":7,"e":"div","a":{"class":"form-group"},"f":[{"t":7,"e":"input","a":{"value":[{"t":2,"r":"password"}],"type":"password","id":"exampleInputPassword1","placeholder":"Password","class":"form-control"}}]}," ",{"t":7,"e":"button","a":{"type":"submit","disabled":[{"t":2,"x":{"r":[],"s":"false"}}],"class":"btn btn-default"},"v":{"click":"signIn"},"f":["Submit"]}]}]}]}]}]}
},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _configuration = require('configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var Playlist = (function () {
  function Playlist(playlist) {
    _classCallCheck(this, Playlist);

    _lodash2['default'].extend(this, playlist);
  }

  _createClass(Playlist, [{
    key: 'save',
    value: function save() {
      if (!this.name) {
        return null;
      }

      // Future fix would be to attach update links to resources in backend for more
      // RESTful behaviour.
      if (this._id) {
        return _axios2['default'].put(this._links.self.href, this).then(Playlist.mapPlaylist, function (err) {
          return console.log(err);
        });
      }

      return _axios2['default'].post(_configuration2['default'].api + '/playlists', this).then(Playlist.mapPlaylist, function (err) {
        return console.log(err);
      });
    }
  }, {
    key: 'del',
    value: function del() {
      return _axios2['default']['delete'](this._links.self.href);
    }
  }], [{
    key: 'mapPlaylist',
    value: function mapPlaylist(response) {
      if (response && response.data) {
        return new Playlist(response.data);
      }
      return {};
    }

    // Maps the response data from the api to this augmented
    // front end domain model.
  }, {
    key: 'mapPlaylists',
    value: function mapPlaylists(response) {
      if (response && response.data) {
        return _lodash2['default'].map(response.data, function (playlist) {
          return new Playlist(playlist);
        });
      }
      return [];
    }
  }, {
    key: 'find',
    value: function find(id) {
      return _axios2['default'].get(_configuration2['default'].api + '/playlists/' + id).then(Playlist.mapPlaylist);
    }

    // Retreive all playlists from the API and map to damain model.
  }, {
    key: 'findAll',
    value: function findAll() {
      return _axios2['default'].get(_configuration2['default'].api + '/playlists').then(Playlist.mapPlaylists);
    }
  }]);

  return Playlist;
})();

exports['default'] = Playlist;
module.exports = exports['default'];

},{"axios":"axios","configuration":"configuration","lodash":"lodash"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _configuration = require('configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var User = (function () {
  function User(user) {
    _classCallCheck(this, User);

    _lodash2['default'].extend(this, user);
  }

  _createClass(User, null, [{
    key: 'mapUser',
    value: function mapUser(response) {
      if (response && response.data) {
        return new User(response.data);
      }
      return {};
    }

    // Maps the response data from the api to this augmented
    // front end domain model.
  }, {
    key: 'mapUsers',
    value: function mapUsers(response) {
      if (response && response.data) {
        return _lodash2['default'].map(response.data, function (user) {
          return new User(user);
        });
      }
      return [];
    }
  }, {
    key: 'find',
    value: function find(id) {
      return _axios2['default'].get(_configuration2['default'].api + '/users/' + id).then(User.mapUser);
    }

    // Retreive all playlists from the API and map to damain model.
  }, {
    key: 'findAll',
    value: function findAll() {
      return _axios2['default'].get(_configuration2['default'].api + '/users').then(User.mapUsers);
    }
  }]);

  return User;
})();

exports['default'] = User;
module.exports = exports['default'];

},{"axios":"axios","configuration":"configuration","lodash":"lodash"}],10:[function(require,module,exports){
module.exports={"v":3,"t":[{"t":7,"e":"nav","a":{"role":"navigation","class":"navbar navbar-default navbar-static-top"},"f":[{"t":7,"e":"div","a":{"class":"container"},"f":[{"t":7,"e":"div","a":{"class":"navbar-header"},"f":[{"t":7,"e":"a","a":{"href":"#/home","class":"navbar-brand"},"f":["PlayList"]}]}," ",{"t":7,"e":"button","v":{"click":"logout"},"a":{"class":"btn navbar-btn btn-danger pull-right"},"f":["Logout"]}," ",{"t":7,"e":"p","a":{"class":"navbar-text pull-right"},"f":[{"t":2,"r":"user.username"}]}]}]}]}
},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ractive = require('ractive');

var _ractive2 = _interopRequireDefault(_ractive);

var _playlistRact = require('./playlist.ract');

var _playlistRact2 = _interopRequireDefault(_playlistRact);

var _navbarNavbarRact = require('../navbar/navbar.ract');

var _navbarNavbarRact2 = _interopRequireDefault(_navbarNavbarRact);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var Playlist = (function () {
  function Playlist(auth, events, playlistService, userService) {
    _classCallCheck(this, Playlist);

    this.axios = _axios2['default'];
    this.auth = auth;
    this.events = events;
    this.playlistService = playlistService;
    this.userService = userService;
    this.playlist = {};
  }

  _createClass(Playlist, [{
    key: 'render',
    value: function render(hash) {
      var _this = this;

      var paths = hash.split('/');
      this.id = paths[paths.length - 1];
      this.loggedInUser = this.auth.loggedInUser();

      this.ractive = new _ractive2['default']({
        el: '#view',
        template: _playlistRact2['default'],
        partials: { navbar: _navbarNavbarRact2['default'] },
        data: {
          searchTerm: '',
          user: this.auth.loggedInUser(),
          users: []
        }
      });

      // Filter out users to add as collaborators based on the search term
      this.ractive.observe('searchTerm', function (newValue, oldValue) {

        if (newValue.length == 0) {
          return _this.ractive.set('addEditorList', []);
        }

        var filtered = _this.users.filter(function (user) {

          // Can't add yourself as an editor.
          if (user._id == _this.loggedInUser._id) return false;

          // Can't add someone who is already an editor.
          var alreadyEditor = _this.playlist.editors.some(function (editor) {
            return user._id == editor._id;
          });

          if (alreadyEditor) return false;

          // User name must match search query
          return newValue == user.username.substring(0, newValue.length);
        });

        _this.ractive.set('addEditorList', filtered);
      });

      // Get user list and save locally.
      this.userService.findAll().then(function (users) {
        _this.users = users;
        _this.ractive.set('users', _this.users);
      });

      // USE playlistService find - to get the cylinder for this view.
      this.playlistService.find(this.id).then(function (playlist) {

        var editPermissions = _this.loggedInUser._id == playlist.ownerID;
        editPermissions = editPermissions || playlist.editors.some(function (editor) {
          return editor._id == _this.loggedInUser._id;
        });

        _this.ractive.set('editPermissions', editPermissions);
        _this.playlist = playlist;
        _this.ractive.set('playlist', _this.playlist);
      });

      // To Add and delete tracks simply modify the playlist and call cylinderListService.save(playlist);
      this.ractive.on('newTrack', function (e, url) {
        _this.playlist.tracks.push({ url: url });
        _this.playlistService.save(_this.playlist);
      });

      this.ractive.on('deleteTrack', function (e, index) {
        _this.playlist.tracks.splice(index, 1);
        _this.playlistService.save(_this.playlist);
      });

      this.ractive.on('addEditor', function (e, user) {
        _this.playlist.editors.push(user._id);
        _this.playlistService.save(_this.playlist);
      });

      this.ractive.on('logout', function () {
        return _this.logout();
      });
    }
  }, {
    key: 'isProtected',
    value: function isProtected() {
      return true;
    }
  }, {
    key: 'logout',
    value: function logout() {
      this.auth.clearLogin();
      this.events.routing.transitionTo.dispatch('login', this);
    }
  }, {
    key: 'unrender',
    value: function unrender() {
      return this.ractive.teardown();
    }
  }]);

  return Playlist;
})();

exports['default'] = Playlist;
module.exports = exports['default'];

},{"../navbar/navbar.ract":10,"./playlist.ract":12,"axios":"axios","ractive":"ractive"}],12:[function(require,module,exports){
module.exports={"v":3,"t":[{"t":8,"r":"navbar"}," ",{"t":7,"e":"div","a":{"class":"container"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-xs-12"},"f":[{"t":7,"e":"h1","f":[{"t":2,"r":"playlist.name"}]}]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-md-9 col-xs-12"},"f":[{"t":7,"e":"table","a":{"class":"table"},"f":[{"t":7,"e":"thead","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th","f":["Tracks"]}," ",{"t":7,"e":"th"}]}," ",{"t":7,"e":"tr"}]}," ",{"t":7,"e":"thead"}," ",{"t":7,"e":"tbody","f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"a","a":{"href":[{"t":2,"r":"url"}]},"f":[{"t":2,"r":"url"}]}]},{"t":4,"f":[" ",{"t":7,"e":"td","f":[{"t":7,"e":"span","a":{"type":"submit","class":"glyphicon glyphicon-trash pull-right"},"v":{"click":{"n":"deleteTrack","d":[{"t":2,"r":"index"}]}}}]}],"n":50,"r":"editPermissions"}]}],"n":52,"i":"index","r":"playlist.tracks"}," ",{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"input","a":{"type":"text","placeholder":"new track","value":[{"t":2,"r":"newTrackUrl"}],"class":"form-control"}}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"button","a":{"type":"submit","class":"btn btn-block btn-success center-block"},"v":{"click":{"n":"newTrack","d":[{"t":2,"r":"newTrackUrl"}]}},"f":["Add"]}]}]}],"n":50,"r":"editPermissions"}]}]}]}," ",{"t":7,"e":"div","a":{"class":"col-md-3 col-xs-12"},"f":[{"t":7,"e":"h4","f":["Owner"]}," ",{"t":7,"e":"div","a":{"class":"list-group"},"f":[{"t":7,"e":"a","a":{"class":"list-group-item"},"f":[{"t":2,"r":"owner"}]}]}," ",{"t":7,"e":"h4","f":["Editors"]}," ",{"t":7,"e":"div","a":{"class":"list-group"},"f":[{"t":4,"f":[{"t":7,"e":"a","a":{"class":"list-group-item"},"f":[{"t":2,"r":"username"}]}],"n":52,"r":"playlist.editors"}," ",{"t":4,"f":[{"t":7,"e":"a","a":{"class":"list-group-item"},"f":[{"t":7,"e":"input","a":{"type":"text","placeholder":"Add collaborators","value":[{"t":2,"r":"searchTerm"}],"class":"form-control"}}]}],"n":50,"r":"editPermissions"}," ",{"t":4,"f":[{"t":7,"e":"a","v":{"click":{"n":"addEditor","d":[{"t":2,"r":"."}]}},"a":{"class":"list-group-item"},"f":[{"t":2,"r":"username"}]}],"n":52,"r":"addEditorList"}]}]}]}]}]}
},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Auth = (function () {
  function Auth(http, store, events, config) {
    _classCallCheck(this, Auth);

    this.http = http;
    this.store = store;
    this.events = events;
    this.config = config;
  }

  _createClass(Auth, [{
    key: 'login',
    value: function login(username, password) {
      var _this = this;

      // making use of es6 destructing here
      var payload = username && password ? { username: username, password: password } : undefined;
      return this.http.post(this.config.api + '/users/login', payload).then(function (response) {

        var accessToken = response.data.accessToken;
        var user = response.data.user;

        _this.store.local.set('accessToken', accessToken);
        _this.store.memory.set('user', user);

        return user;
      });
    }
  }, {
    key: 'restoreLogin',
    value: function restoreLogin() {
      var _this2 = this;

      console.log(this.config.api + '/users/login');
      return this.http.get(this.config.api + '/users/login').then(function (response) {
        _this2.store.memory.set('user', response.data.user);
        _this2.events.auth.restoredLogin.dispatch(null, response.data.user);
      }, function (err) {
        _this2.events.auth.restoredLogin.dispatch(err);
      });
    }
  }, {
    key: 'clearLogin',
    value: function clearLogin() {
      this.store.local.remove('accessToken');
      this.store.memory.remove('user');
    }
  }, {
    key: 'loggedInUser',
    value: function loggedInUser() {
      return this.store.memory.get('user');
    }
  }]);

  return Auth;
})();

exports['default'] = Auth;
module.exports = exports['default'];

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _signals = require('signals');

var _signals2 = _interopRequireDefault(_signals);

var Events = function Events() {
  _classCallCheck(this, Events);

  this.http = {
    failedRequest: new _signals2['default'].Signal()
  };

  this.routing = {
    transitionTo: new _signals2['default'].Signal(),
    accessDenied: new _signals2['default'].Signal(),
    notFound: new _signals2['default'].Signal()
  };

  this.auth = {
    restoredLogin: new _signals2['default'].Signal()
  };
};

exports['default'] = new Events();
module.exports = exports['default'];

},{"signals":"signals"}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var defaultConfiguration = {
  isFormValid: 'parsleyValid',
  focus: 'none',
  errorClass: 'has-error',
  successClass: 'has-success',
  classHandler: function classHandler(ParsleyField) {
    return ParsleyField.$element.parents('.form-group');
  },
  errorsContainer: function errorsContainer(ParsleyField) {
    return ParsleyField.$element.parents('.form-group');
  },
  errorsWrapper: '<span class="help-block">',
  errorTemplate: '<div></div>'
};

// A decorator function takes two arguments. The DOM element the decorator was called from
// and any additional arguments added to the decorator attribute of that element.
var parsleyDecorator = function parsleyDecorator(node, content) {

  // Have not investigated any source code but couldn't find any docs stating context
  // of invocation was ractive library BUT seems to work.
  var ractive = this;

  // use ractive to set the data model. Initially form is not valid.
  ractive.set(parsleyDecorator.config.isFormValid, false);

  // When parsley loads it registers itself with jquery and adds a parsley function.
  // this function creates a new ParsleyFactory from the JQ element and the extra argument
  // passed directly.
  var parsleyForm = $(node).parsley(parsleyDecorator.config);

  // Gets all the input elements of the form.
  var inputFields = $(node).children('.form-group').children('input') || [];

  // Function that validates the from and sets the 'parsleyValid' model.
  function validate() {
    ractive.set(parsleyDecorator.config.isFormValid, parsleyForm.validate());
  }

  // attaches a callback to validate the form whenever the 'blur' or 'keyup' event occur
  // for each input field.
  _lodash2['default'].forEach(inputFields, function (elem) {
    // The blur event is sent to an element when it loses focus.
    $(elem).blur(validate);
    $(elem).keyup(validate);
  });

  // Ractive requires decorators to return a teardown function. The
  // teardown functions defines any action required if the DOM element
  // is removed.
  return {
    teardown: function teardown() {
      // unbind removes event handlers.
      _lodash2['default'].forEach(inputFields, function (elem) {
        return $elem.unbind();
      });
      parsleyForm.destroy();
    }
  };
};

// Best practise to assign any decorator variables by attaching them to the function
// rather than adding them as a long string of arguments to the decorator in the html
parsleyDecorator.config = defaultConfiguration;
exports['default'] = parsleyDecorator;
module.exports = exports['default'];

},{"lodash":"lodash"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var PlaylistService = (function () {

  // Pass the domain model for playlists.

  function PlaylistService(Playlist) {
    _classCallCheck(this, PlaylistService);

    this.Playlist = Playlist;
  }

  _createClass(PlaylistService, [{
    key: 'find',
    value: function find(id) {
      return this.Playlist.find(id);
    }
  }, {
    key: 'findAll',
    value: function findAll() {
      return this.Playlist.findAll();
    }

    // Find all playlists belonging to currently logged in user
  }, {
    key: 'findPersonal',
    value: function findPersonal(userId) {
      return this.findAll().then(function (playlists) {
        return _lodash2['default'].filter(playlists, { ownerID: userId });
      });
    }

    // Find all public playlists (those which logged in user does not own)
  }, {
    key: 'findPublic',
    value: function findPublic(userId) {
      return this.findAll().then(function (playlists) {
        return _lodash2['default'].filter(playlists, function (pl) {
          return pl.ownerID != userId;
        });
      });
    }

    // Create and return a new playlist.
  }, {
    key: 'add',
    value: function add(playlist) {
      playlist = new this.Playlist(playlist);
      return playlist.save();
    }
  }, {
    key: 'remove',
    value: function remove(playlist) {
      return playlist && playlist.del();
    }
  }, {
    key: 'save',
    value: function save(playlist) {
      return playlist && playlist.save();
    }
  }]);

  return PlaylistService;
})();

exports['default'] = PlaylistService;
module.exports = exports['default'];

},{"axios":"axios","lodash":"lodash"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _crossroads = require('crossroads');

var _crossroads2 = _interopRequireDefault(_crossroads);

var _hasher = require('hasher');

var _hasher2 = _interopRequireDefault(_hasher);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Router = (function () {
  function Router(auth, events) {
    _classCallCheck(this, Router);

    this.auth = auth;
    this.events = events;
  }

  _createClass(Router, [{
    key: 'initialise',
    value: function initialise() {
      var _this = this;

      // looks like hasher watches hash and emits signals
      // Here we declare how to handle initial hash and any
      // further changes.
      _hasher2['default'].initialized.add(this.parseHash);
      _hasher2['default'].changed.add(this.parseHash);
      _hasher2['default'].init();

      // bypassed callbacks are run everytime a route cuold not be found to match the request.
      // Writing like this capture this in the closure?
      _crossroads2['default'].bypassed.add(function () {
        return _this.bypassedHandler();
      });
    }
  }, {
    key: 'addRoute',
    value: function addRoute(path, view) {
      var _this2 = this;

      // addRoute method to register a handler to a path.
      // Here, _.bind sets the function invocation context (this) of view.render to view

      view.render_h = function () {
        view.render(_hasher2['default'].getHash());
      };

      var route = _crossroads2['default'].addRoute(path, _lodash2['default'].bind(view.render_h, view));

      // Attach a handler for the switch event
      route.matched.add(function () {
        return _this2.matchedHandler(path, view);
      });
      route.switched.add(function () {
        return _this2.switchedHandler(view);
      });
    }
  }, {
    key: 'bypassedHandler',
    value: function bypassedHandler() {
      this.events.routing.notFound.dispatch();
    }
  }, {
    key: 'switchedHandler',
    value: function switchedHandler(view) {
      view.unrender();
    }
  }, {
    key: 'matchedHandler',
    value: function matchedHandler(path, view) {
      var _this3 = this;

      if (view.isProtected() && !this.auth.loggedInUser()) {
        view.unrender().then(function () {
          return _this3.events.routing.accessDenied.dispatch(path);
        });
      }
    }
  }, {
    key: 'parseHash',
    value: function parseHash(newHash, oldHash) {
      // Whenever the hash changes crossroads will perform routing
      // based on configured routes. Rendering and tearing down pages.
      _crossroads2['default'].parse(newHash);
    }
  }, {
    key: 'currentHash',
    value: function currentHash() {
      return _hasher2['default'].getHash();
    }
  }, {
    key: 'transitionTo',
    value: function transitionTo(path) {
      _hasher2['default'].setHash(path);
    }
  }]);

  return Router;
})();

exports['default'] = Router;
module.exports = exports['default'];

},{"crossroads":"crossroads","hasher":"hasher","lodash":"lodash"}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _store = require('store');

var _store2 = _interopRequireDefault(_store);

var InMemory = (function () {
  function InMemory() {
    _classCallCheck(this, InMemory);

    this.store = {};
  }

  _createClass(InMemory, [{
    key: 'set',
    value: function set(key, value) {
      this.store[key] = value;
    }
  }, {
    key: 'get',
    value: function get(key) {
      return this.store[key];
    }
  }, {
    key: 'remove',
    value: function remove(key) {
      delete this.store[key];
    }
  }]);

  return InMemory;
})();

var Local = (function () {
  function Local() {
    _classCallCheck(this, Local);

    this.store = _store2['default'];
  }

  _createClass(Local, [{
    key: 'set',
    value: function set(key, value) {
      this.store.set(key, value);
    }
  }, {
    key: 'get',
    value: function get(key) {
      return this.store.get(key);
    }
  }, {
    key: 'remove',
    value: function remove(key) {
      this.store.remove(key);
    }
  }]);

  return Local;
})();

var Storage = function Storage() {
  _classCallCheck(this, Storage);

  this.local = new Local();
  this.memory = new InMemory();
};

exports['default'] = new Storage();
module.exports = exports['default'];

},{"store":"store"}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var UserService = (function () {

  // Pass the domain model for playlists.

  function UserService(User) {
    _classCallCheck(this, UserService);

    this.User = User;
  }

  _createClass(UserService, [{
    key: 'find',
    value: function find(id) {
      return this.User.find(id);
    }
  }, {
    key: 'findAll',
    value: function findAll() {
      return this.User.findAll();
    }
  }]);

  return UserService;
})();

exports['default'] = UserService;
module.exports = exports['default'];

},{"axios":"axios","lodash":"lodash"}],"configuration":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  api: 'http://localhost:3000/api'
};
module.exports = exports['default'];

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9qYXRoL3Byb2plY3RzL3BsYXlsaXN0LmpzL3dlYi1jbGllbnQvc3JjL2pzLzQwNC80MDQuZXM2Iiwic3JjL2pzLzQwNC80MDQucmFjdCIsIkM6L1VzZXJzL2phdGgvcHJvamVjdHMvcGxheWxpc3QuanMvd2ViLWNsaWVudC9zcmMvanMvYXBwLmVzNiIsIkM6L1VzZXJzL2phdGgvcHJvamVjdHMvcGxheWxpc3QuanMvd2ViLWNsaWVudC9zcmMvanMvaG9tZS9ob21lLmVzNiIsInNyYy9qcy9ob21lL2hvbWUucmFjdCIsIkM6L1VzZXJzL2phdGgvcHJvamVjdHMvcGxheWxpc3QuanMvd2ViLWNsaWVudC9zcmMvanMvbG9naW4vbG9naW4uZXM2Iiwic3JjL2pzL2xvZ2luL2xvZ2luLnJhY3QiLCJDOi9Vc2Vycy9qYXRoL3Byb2plY3RzL3BsYXlsaXN0LmpzL3dlYi1jbGllbnQvc3JjL2pzL21vZGVscy9wbGF5bGlzdC5lczYiLCJDOi9Vc2Vycy9qYXRoL3Byb2plY3RzL3BsYXlsaXN0LmpzL3dlYi1jbGllbnQvc3JjL2pzL21vZGVscy91c2VyLmVzNiIsInNyYy9qcy9uYXZiYXIvbmF2YmFyLnJhY3QiLCJDOi9Vc2Vycy9qYXRoL3Byb2plY3RzL3BsYXlsaXN0LmpzL3dlYi1jbGllbnQvc3JjL2pzL3BsYXlsaXN0L3BsYXlsaXN0LmVzNiIsInNyYy9qcy9wbGF5bGlzdC9wbGF5bGlzdC5yYWN0IiwiQzovVXNlcnMvamF0aC9wcm9qZWN0cy9wbGF5bGlzdC5qcy93ZWItY2xpZW50L3NyYy9qcy9zZXJ2aWNlcy9hdXRoLmVzNiIsIkM6L1VzZXJzL2phdGgvcHJvamVjdHMvcGxheWxpc3QuanMvd2ViLWNsaWVudC9zcmMvanMvc2VydmljZXMvZXZlbnRzLmVzNiIsIkM6L1VzZXJzL2phdGgvcHJvamVjdHMvcGxheWxpc3QuanMvd2ViLWNsaWVudC9zcmMvanMvc2VydmljZXMvcGFyc2xleS1kZWNvcmF0b3IuZXM2IiwiQzovVXNlcnMvamF0aC9wcm9qZWN0cy9wbGF5bGlzdC5qcy93ZWItY2xpZW50L3NyYy9qcy9zZXJ2aWNlcy9wbGF5bGlzdFNlcnZpY2UuZXM2IiwiQzovVXNlcnMvamF0aC9wcm9qZWN0cy9wbGF5bGlzdC5qcy93ZWItY2xpZW50L3NyYy9qcy9zZXJ2aWNlcy9yb3V0ZXIuZXM2IiwiQzovVXNlcnMvamF0aC9wcm9qZWN0cy9wbGF5bGlzdC5qcy93ZWItY2xpZW50L3NyYy9qcy9zZXJ2aWNlcy9zdG9yYWdlLmVzNiIsIkM6L1VzZXJzL2phdGgvcHJvamVjdHMvcGxheWxpc3QuanMvd2ViLWNsaWVudC9zcmMvanMvc2VydmljZXMvdXNlclNlcnZpY2UuZXM2IiwiQzovVXNlcnMvamF0aC9wcm9qZWN0cy9wbGF5bGlzdC5qcy93ZWItY2xpZW50L2NvbmZpZy1kZXYuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O3VCQ0FvQixTQUFTOzs7O29CQUNaLFlBQVk7Ozs7SUFFdkIsUUFBUTtXQUFSLFFBQVE7MEJBQVIsUUFBUTs7O2VBQVIsUUFBUTs7V0FHTixrQkFBRztBQUNQLFVBQUksQ0FBQyxPQUFPLEdBQUcseUJBQVk7QUFDekIsVUFBRSxFQUFFLE9BQU87QUFDWCxnQkFBUSxtQkFBTTtPQUNmLENBQUMsQ0FBQztLQUNKOzs7V0FFVSx1QkFBRztBQUNaLGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztXQUVPLG9CQUFHO0FBQ1QsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ2hDOzs7U0FoQkcsUUFBUTs7O3FCQW9CQyxRQUFROzs7O0FDdkJ2Qjs7Ozs7O3VCQ0FxQixTQUFTOzs7O3VCQUNULFNBQVM7Ozs7cUJBQ1QsT0FBTzs7Ozt5QkFDUCxXQUFXOzs7Ozs7aUNBR1QsdUJBQXVCOzs7O2lDQUN2Qix1QkFBdUI7Ozs7K0JBQ3ZCLHFCQUFxQjs7OztrQ0FDckIs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NUI7OztTQWJHLFdBQVc7OztxQkFpQkYsV0FBVzs7Ozs7Ozs7O3FCQ3BCWDtBQUNiLEtBQUcsRUFBRSwyQkFBMkI7Q0FDakMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJhY3RpdmUgZnJvbSAncmFjdGl2ZSc7XHJcbmltcG9ydCBodG1sIGZyb20gJy4vNDA0LnJhY3QnO1xyXG5cclxuY2xhc3MgTm90Rm91bmQge1xyXG5cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgdGhpcy5yYWN0aXZlID0gbmV3IFJhY3RpdmUoe1xyXG4gICAgICBlbDogJyN2aWV3JyxcclxuICAgICAgdGVtcGxhdGU6IGh0bWxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaXNQcm90ZWN0ZWQoKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICB1bnJlbmRlcigpIHtcclxuICAgIHJldHVybiB0aGlzLnJhY3RpdmUudGVhcmRvd24oKTtcclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBOb3RGb3VuZFxyXG4iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGFpbmVyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJyb3dcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbC14cy0xMlwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMVwiLFwiZlwiOltcIjQwNCBwYWdlIG5vdCBmb3VuZFwiXX1dfV19XX1dfSIsImltcG9ydCBSYWN0aXZlICBmcm9tICdyYWN0aXZlJztcclxuaW1wb3J0IExvZ2Rvd24gIGZyb20gJ2xvZ2Rvd24nO1xyXG5pbXBvcnQgYXhpb3MgICAgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgUGFyc2xleSAgZnJvbSAncGFyc2xleWpzJztcclxuXHJcbi8vIFMgc3VmZml4IGZvciBTRVJWSUNFU1xyXG5pbXBvcnQgUm91dGVyICAgICBmcm9tICcuL3NlcnZpY2VzL3JvdXRlci5lczYnO1xyXG5pbXBvcnQgZXZlbnRzICAgICBmcm9tICcuL3NlcnZpY2VzL2V2ZW50cy5lczYnO1xyXG5pbXBvcnQgQXV0aCAgICAgICBmcm9tICcuL3NlcnZpY2VzL2F1dGguZXM2JztcclxuaW1wb3J0IHN0b3JhZ2UgICAgZnJvbSAnLi9zZXJ2aWNlcy9zdG9yYWdlLmVzNic7XHJcbmltcG9ydCBQbGF5bGlzdFMgIGZyb20gJy4vc2VydmljZXMvcGxheWxpc3RTZXJ2aWNlLmVzNic7XHJcbmltcG9ydCBVc2VyUyAgICAgIGZyb20gJy4vc2VydmljZXMvdXNlclNlcnZpY2UuZXM2JztcclxuXHJcbmltcG9ydCBwYXJzbGV5RGVjb3JhdG9yICBmcm9tICcuL3NlcnZpY2VzL3BhcnNsZXktZGVjb3JhdG9yLmVzNic7IFxyXG5SYWN0aXZlLmRlY29yYXRvcnMucGFyc2xleSA9IHBhcnNsZXlEZWNvcmF0b3I7XHJcblxyXG5cclxuLy8gTW9kZWxzXHJcbmltcG9ydCBQbGF5bGlzdE0gZnJvbSAnLi9tb2RlbHMvcGxheWxpc3QuZXM2JztcclxuaW1wb3J0IFVzZXJNICAgICBmcm9tICcuL21vZGVscy91c2VyLmVzNic7XHJcblxyXG4vLyBDIHN1ZmZpeCBmb3IgQ09OVFJPTExFUlMgXHJcbmltcG9ydCBIb21lQyAgICAgICAgZnJvbSAnLi9ob21lL2hvbWUuZXM2JztcclxuaW1wb3J0IFBsYXlsaXN0QyAgICBmcm9tICcuL3BsYXlsaXN0L3BsYXlsaXN0LmVzNic7XHJcbmltcG9ydCBMb2dpbkMgICAgICAgZnJvbSAnLi9sb2dpbi9sb2dpbi5lczYnO1xyXG5pbXBvcnQgTm90Rm91bmRDICAgIGZyb20gJy4vNDA0LzQwNC5lczYnO1xyXG5cclxuaW1wb3J0IGNvbmZpZyAgIGZyb20gJ2NvbmZpZ3VyYXRpb24nO1xyXG5cclxubGV0IGxvZ2dlciAgPSBuZXcgTG9nZG93bih7cHJlZml4OiAnYXBwJ30pO1xyXG5sZXQgYXV0aCAgICA9IG5ldyBBdXRoKGF4aW9zLCBzdG9yYWdlLCBldmVudHMsIGNvbmZpZyk7XHJcbmxldCByb3V0ZXIgID0gbmV3IFJvdXRlcihhdXRoLCBldmVudHMpO1xyXG5cclxubGV0IHBsU2VydmljZSA9IG5ldyBQbGF5bGlzdFMoUGxheWxpc3RNKTtcclxubGV0IHVTZXJ2aWNlICA9IG5ldyBVc2VyUyhVc2VyTSk7XHJcblxyXG4vLyBJbnRlcmNlcHRvcnMgYWxsb3cgdXMgdG8gY2hhbmdlIGhlYWRlcnMgYmVmb3JlIHJlcXVlc3QgaXMgc2VudC5cclxuYXhpb3MuaW50ZXJjZXB0b3JzLnJlcXVlc3QudXNlKGZ1bmN0aW9uKGNvbmZpZykge1xyXG4gIGxldCBhY2Nlc3NUb2tlbiA9IHN0b3JhZ2UubG9jYWwuZ2V0KCdhY2Nlc3NUb2tlbicpO1xyXG4gIGlmKGFjY2Vzc1Rva2VuKSBjb25maWcuaGVhZGVyc1snWC1BdXRoLVRva2VuJ10gPSBhY2Nlc3NUb2tlbjtcclxuICBlbHNlIGRlbGV0ZSBjb25maWcuaGVhZGVyc1snWC1BdXRoLVRva2VuJ107XHJcbiAgcmV0dXJuIGNvbmZpZztcclxufSk7XHJcblxyXG5yb3V0ZXIuYWRkUm91dGUoJ2xvZ2luJywgbmV3IExvZ2luQyhhdXRoLCBldmVudHMpKTtcclxucm91dGVyLmFkZFJvdXRlKCdob21lJywgbmV3IEhvbWVDKGF1dGgsIGV2ZW50cywgcGxTZXJ2aWNlKSk7XHJcbnJvdXRlci5hZGRSb3V0ZSgncGxheWxpc3Qve2lkfScsIG5ldyBQbGF5bGlzdEMoYXV0aCwgZXZlbnRzLCBwbFNlcnZpY2UsIHVTZXJ2aWNlKSk7XHJcbnJvdXRlci5hZGRSb3V0ZSgnNDA0JywgbmV3IE5vdEZvdW5kQygpKTtcclxuXHJcbi8vIEZpcnN0IHRoaW5nIG9uIHBhZ2UgbG9hZCAoYmVmb3JlIHRyeWluZyB0byByb3V0ZSB0byB0aGUgY3VycmVudCBoYXNoKSBpcyB0byBlc3RhYmxpc2ggaWYgdGhlIHVzZXJcclxuLy8gaXMgbG9nZ2VkIGluLCBhbmQgaWYgbm90LCB3aGV0aGVyIHRoZXkgc2hvdWxkIGJlIGRpcmVjdGVkIHNvbWV3aGVyZSBlbHNlIGZpcnN0LlxyXG5jb25zb2xlLmxvZygnd29vb29vJylcclxuYXV0aC5yZXN0b3JlTG9naW4oKS50aGVuKGZ1bmN0aW9uKCkge1xyXG5cclxuICAvLyBBZnRlciBsb2dpbiBoYXMgYmVlbiByZXN0b3JlZCB3ZSBjYW4gaW5pdGlhbGlzZSByb3V0aW5nLiBUaGlzIHdpbGwgY2F1c2UgdGhlIHJvdXRlclxyXG4gIC8vIHRvIGxvYWQgdGhlIHBhZ2UgY29ycmVzcG9uZGluZyB0byB0aGUgY3VycmVudCByb3V0ZS5cclxuICAvLyBJbml0aWFsaXNuZyB0aGUgcm91dGVyIGFmdGVyIGF1dGhlbnRpY2F0aW9uIG1lYW5zOlxyXG4gIC8vIGEpIHdlIGNhbiBjbGVhbmx5IGNoZWNrIHRoYXQgdGhlIHVzZXIgaXMgYXV0aGVudGljYXRlZCBmb3IgdGhlIHBhZ2VcclxuICAvLyBiKSB0aGUgcmVzdG9yZWQgbG9naW4gaGFuZGxlciBjYW4gdHJhbnNpdGlvbiB0byBhbnkgYXBwcm9wcmlhdGUgcGFnZXMgQkVGT1JFIHRoZSByb3V0ZXJcclxuICAvLyAgICBpbml0aWFsaXNlcyBhbmQgc3RhcnRzIHRvIGF1dG8gbG9hZCB3aGF0ZXZlciBsb2NhdGlvbiB0aGUgYXBwIG1pZ2h0IGJlIGF0LlxyXG4gIHJvdXRlci5pbml0aWFsaXNlKCk7XHJcbn0pO1xyXG5cclxuLy8gRXZlbnQgaXMgZmlyZWQgYWZ0ZXIgYXV0aCBzZXJ2aWNlIGhhcyBhdHRlbXB0ZWQgdG8gbG9nIGluLlxyXG5ldmVudHMuYXV0aC5yZXN0b3JlZExvZ2luLmFkZChmdW5jdGlvbihlcnIsIHVzZXIpIHtcclxuXHJcbiAgaWYoZXJyICYmIGVyci5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgbG9nZ2VyLndhcm4oJ0EgZmFpbGVkIGxvZyBpbiBhdHRlbXB0IGhhcyBiZWVuIG1hZGUnKTtcclxuICAgIHJldHVybiByb3V0ZXIudHJhbnNpdGlvblRvKCdsb2dpbicpO1xyXG4gIH1cclxuXHJcbiAgaWYoZXJyKSB7XHJcbiAgICBsb2dnZXIud2FybignY29ubmVjdGlvbiB0byB0aGUgYXBpIGhhcyBiZWVuIGxvc3QnKTtcclxuICAgIHJldHVybiByb3V0ZXIudHJhbnNpdGlvblRvKCdzb3JyeScpO1xyXG4gIH1cclxuXHJcbiAgLy8gSWYgbm8gZXJyb3IgKHRoZSB1c2VyIGlzIGxvZ2dlZCkgdGhlbiB0aGUgcm91dGVyIHdpbGwgYXV0b21hdGljYWxseSBsb2FkIHRoZSBwYWdlXHJcbiAgLy8gYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IGhhc2gvZnJhZ21lbnQgd2hlbiBpdCBpbml0aWFsaXNlcy5cclxuICBsb2dnZXIubG9nKCd0aGUgbG9naW4gY3JlZGVudGlhbHMgaGF2ZSBiZWVuIHJlc3RvcmVkJyk7XHJcbn0pO1xyXG5cclxuZXZlbnRzLnJvdXRpbmcuYWNjZXNzRGVuaWVkLmFkZChmdW5jdGlvbihwYXRoKSB7XHJcbiAgXHJcbiAgbG9nZ2VyLndhcm4oJ2FjY2VzcyB0byAnICsgcGF0aCArICcgaGFzIGJlZW4gZGVuaWVkJyk7XHJcbiAgcmV0dXJuIHJvdXRlci50cmFuc2l0aW9uVG8oJ2xvZ2luJyk7XHJcbn0pO1xyXG5cclxuZXZlbnRzLnJvdXRpbmcubm90Rm91bmQuYWRkKGZ1bmN0aW9uKCkge1xyXG4gIGxvZ2dlci5sb2coJ3RoZSBlbnRlcmVkIHBhdGggY291bGQgbm90IGJlIGZvdW5kJyk7XHJcbiAgcmV0dXJuIHJvdXRlci50cmFuc2l0aW9uVG8oJzQwNCcpO1xyXG59KTtcclxuXHJcbmV2ZW50cy5yb3V0aW5nLnRyYW5zaXRpb25Uby5hZGQoZnVuY3Rpb24ocGF0aCwgdmlldykge1xyXG4gIGxvZ2dlci5sb2coJ3RyYW5zaXRpb25pbmcgdG8gJyArIHBhdGgpO1xyXG4gIHZpZXcudW5yZW5kZXIoKS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICByb3V0ZXIudHJhbnNpdGlvblRvKHBhdGgpO1xyXG4gIH0pO1xyXG59KTtcclxuIiwiaW1wb3J0IFJhY3RpdmUgZnJvbSAncmFjdGl2ZSc7XHJcbmltcG9ydCBodG1sIGZyb20gJy4vaG9tZS5yYWN0JztcclxuaW1wb3J0IG5hdmJhciBmcm9tICcuLi9uYXZiYXIvbmF2YmFyLnJhY3QnO1xyXG5cclxuY2xhc3MgSG9tZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGF1dGgsIGV2ZW50cywgcGxheWxpc3RTZXJ2aWNlKXtcclxuICAgIHRoaXMuYXV0aCAgID0gYXV0aDtcclxuICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzO1xyXG4gICAgdGhpcy5wZXJzb25hbFBsYXlsaXN0cyA9IFtdO1xyXG4gICAgdGhpcy5wdWJsaWNQbGF5bGlzdHMgPSBbXTtcclxuICAgIHRoaXMucGxheWxpc3RTZXJ2aWNlID0gcGxheWxpc3RTZXJ2aWNlO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKGhhc2gpIHtcclxuXHJcbiAgICBsZXQgbG9nZ2VkSW5Vc2VyID0gdGhpcy5hdXRoLmxvZ2dlZEluVXNlcigpOyBcclxuICAgIHRoaXMucmFjdGl2ZSA9IG5ldyBSYWN0aXZlKHtcclxuICAgICAgZWw6ICcjdmlldycsXHJcbiAgICAgIHRlbXBsYXRlOiBodG1sLFxyXG4gICAgICBwYXJ0aWFsczoge25hdmJhcjogbmF2YmFyfSxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIHVzZXI6IGxvZ2dlZEluVXNlclxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG5cclxuICAgIHRoaXMucmFjdGl2ZS5vbignbmV3TGlzdCcsIChlLCBuYW1lKSA9PiB7XHJcbiAgICAgIHRoaXMucGxheWxpc3RTZXJ2aWNlLmFkZCh7bmFtZX0pLnRoZW4oKHBsYXlsaXN0KSA9PiB7XHJcbiAgICAgICAgLy8gUmFjdGl2ZSBpbnRlcmNlcHRzIHB1c2ggbWV0aG9kIGJ5IGRlZmF1bHRcclxuICAgICAgICB0aGlzLnBlcnNvbmFsUGxheWxpc3RzLnB1c2gocGxheWxpc3QpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICB0aGlzLnJhY3RpdmUub24oJ3JlbW92ZUxpc3QnLCAoZSwgbGlzdCwgaW5kZXgpID0+IHtcclxuICAgICAgdGhpcy5wbGF5bGlzdFNlcnZpY2UucmVtb3ZlKGxpc3QpO1xyXG4gICAgICB0aGlzLnBlcnNvbmFsUGxheWxpc3RzLnNwbGljZShpbmRleCwxKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICB0aGlzLnJhY3RpdmUub24oJ2xvZ291dCcsICgpID0+IHRoaXMubG9nb3V0KCkpOyBcclxuXHJcblxyXG4gICAgdGhpcy5wbGF5bGlzdFNlcnZpY2UuZmluZFB1YmxpYyhsb2dnZWRJblVzZXIuX2lkKS50aGVuKChwdWJsaWNQbGF5bGlzdHMpID0+IHtcclxuICAgICAgdGhpcy5wdWJsaWNQbGF5bGlzdHMgPSBwdWJsaWNQbGF5bGlzdHM7XHJcbiAgICAgIHRoaXMucmFjdGl2ZS5zZXQoJ3B1YmxpY1BsYXlsaXN0cycsIHRoaXMucHVibGljUGxheWxpc3RzKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICB0aGlzLnBsYXlsaXN0U2VydmljZS5maW5kUGVyc29uYWwobG9nZ2VkSW5Vc2VyLl9pZCkudGhlbigocGxheWxpc3RzKSA9PiB7XHJcbiAgICAgIC8vIHJhY3RpdmUudXBkYXRlIG9ubHkgd29ya3Mgd2l0aCBtb2RpZmljYXRpb24gbGlrZSBhclszXSA9IG4uIG5vdCBsaWtlIGFyID0gW107XHJcbiAgICAgIHRoaXMucGVyc29uYWxQbGF5bGlzdHMgPSBwbGF5bGlzdHM7XHJcbiAgICAgIHRoaXMucmFjdGl2ZS5zZXQoJ3BlcnNvbmFsUGxheWxpc3RzJywgdGhpcy5wZXJzb25hbFBsYXlsaXN0cyk7XHJcbiAgICB9KVxyXG5cclxuICB9XHJcblxyXG4gIGxvZ291dCgpIHtcclxuICAgIHRoaXMuYXV0aC5jbGVhckxvZ2luKCk7XHJcbiAgICB0aGlzLmV2ZW50cy5yb3V0aW5nLnRyYW5zaXRpb25Uby5kaXNwYXRjaCgnbG9naW4nLCB0aGlzKTtcclxuICB9XHJcblxyXG4gIGlzUHJvdGVjdGVkKCkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICB1bnJlbmRlcigpIHtcclxuICAgIHJldHVybiB0aGlzLnJhY3RpdmUudGVhcmRvd24oKVxyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhvbWU7XHJcbiIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6OCxcInJcIjpcIm5hdmJhclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250YWluZXJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInJvd1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sLXhzLTEyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImgzXCIsXCJmXCI6W1wiWW91ciBwbGF5bGlzdHNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImFcIjp7XCJjbGFzc1wiOlwidGFibGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGhlYWRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRoXCIsXCJmXCI6W1wiTmFtZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0aFwifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0Ym9keVwiLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpbXCIjL3BsYXlsaXN0L1wiLHtcInRcIjoyLFwiclwiOlwiX2lkXCJ9XX0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibmFtZVwifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJhcmlhLWhpZGRlblwiOlwidHJ1ZVwiLFwiY2xhc3NcIjpcImdseXBoaWNvbiBnbHlwaGljb24tdHJhc2ggcHVsbC1yaWdodFwifSxcInZcIjp7XCJjbGlja1wiOntcIm5cIjpcInJlbW92ZUxpc3RcIixcImRcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9LFwiLFwiLHtcInRcIjoyLFwiclwiOlwibnVtXCJ9XX19fV19XX1dLFwiblwiOjUyLFwiaVwiOlwibnVtXCIsXCJyXCI6XCJwZXJzb25hbFBsYXlsaXN0c1wifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcInRleHRcIixcInBsYWNlaG9sZGVyXCI6XCJuZXcgbGlzdFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJuZXdMaXN0TmFtZVwifV0sXCJjbGFzc1wiOlwiZm9ybS1jb250cm9sXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJzdWJtaXRcIixcImNsYXNzXCI6XCJidG4gYnRuLWJsb2NrIGJ0bi1zdWNjZXNzIGNlbnRlci1ibG9ja1wifSxcInZcIjp7XCJjbGlja1wiOntcIm5cIjpcIm5ld0xpc3RcIixcImRcIjpbe1widFwiOjIsXCJyXCI6XCJuZXdMaXN0TmFtZVwifV19fSxcImZcIjpbXCJBZGRcIl19XX1dfV19XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInJvd1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sLXhzLTEyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImgzXCIsXCJmXCI6W1wiUGxheWxpc3RzIGJ5IG90aGVyc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcImNsYXNzXCI6XCJ0YWJsZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0aGVhZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGhcIixcImZcIjpbXCJOYW1lXCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0Ym9keVwiLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpbXCIjL3BsYXlsaXN0L1wiLHtcInRcIjoyLFwiclwiOlwiX2lkXCJ9XX0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibmFtZVwifV19XX1dfV0sXCJuXCI6NTIsXCJpXCI6XCJudW1cIixcInJcIjpcInB1YmxpY1BsYXlsaXN0c1wifV19XX1dfV19XX1dfSIsImltcG9ydCBSYWN0aXZlIGZyb20gJ3JhY3RpdmUnXHJcbmltcG9ydCBodG1sIGZyb20gJy4vbG9naW4ucmFjdCdcclxuXHJcbmNsYXNzIExvZ2luIHtcclxuXHJcbiAgY29uc3RydWN0b3IoYXV0aCwgZXZlbnRzKSB7XHJcbiAgICB0aGlzLmF1dGggPSBhdXRoO1xyXG4gICAgdGhpcy5ldmVudHMgPSBldmVudHM7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcblxyXG4gICAgdGhpcy5yYWN0aXZlID0gbmV3IFJhY3RpdmUoe1xyXG4gICAgICBlbDogJyN2aWV3JyxcclxuICAgICAgdGVtcGxhdGU6IGh0bWwsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBzaG93RXJyb3I6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucmFjdGl2ZS5vbignc2lnbkluJywgKCkgPT4ge1xyXG4gICAgICBsZXQgdXNlcm5hbWUgPSB0aGlzLnJhY3RpdmUuZ2V0KCd1c2VybmFtZScpO1xyXG4gICAgICBsZXQgcGFzc3dvcmQgPSB0aGlzLnJhY3RpdmUuZ2V0KCdwYXNzd29yZCcpO1xyXG4gICAgICB0aGlzLnNpZ25Jbih1c2VybmFtZSwgcGFzc3dvcmQpO1xyXG4gICAgfSk7XHJcbiAgICAgICAgXHJcbiAgfVxyXG5cclxuICBzaWduSW4odXNlcm5hbWUsIHBhc3N3b3JkKSB7XHJcbiAgICB0aGlzLmF1dGgubG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKVxyXG4gICAgICAudGhlbigodXNlcikgPT4gdGhpcy5nb1RvSG9tZVNjcmVlbigpLFxyXG4gICAgICAgICAgICAoZXJyKSA9PiB0aGlzLnNob3dFcnJvcihlcnIpKVxyXG4gIH1cclxuXHJcbiAgc2hvd0Vycm9yKGVycikge1xyXG4gICAgdGhpcy5yYWN0aXZlLnNldCgnc2hvd0Vycm9yJywgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBnb1RvSG9tZVNjcmVlbigpIHtcclxuICAgIHRoaXMuZXZlbnRzLnJvdXRpbmcudHJhbnNpdGlvblRvLmRpc3BhdGNoKCdob21lJywgdGhpcyk7XHJcbiAgfSBcclxuXHJcbiAgaXNQcm90ZWN0ZWQoKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICB1bnJlbmRlcigpIHtcclxuICAgIHJldHVybiB0aGlzLnJhY3RpdmUudGVhcmRvd24oKTtcclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpblxyXG4iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGFpbmVyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJyb3dcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wic3R5bGVcIjpcInBhZGRpbmc6IDUwcHggMDtcIixcImNsYXNzXCI6XCJjb2wteHMtNiBjb2wteHMtb2Zmc2V0LTNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDFcIixcImFcIjp7XCJzdHlsZVwiOlwidGV4dC1hbGlnbjpjZW50ZXI7XCJ9LFwiZlwiOltcImVsY29tZSBUbyBQbGF5bGlzdFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJoNFwiLFwiYVwiOntcInN0eWxlXCI6XCJ0ZXh0LWFsaWduOmNlbnRlcjtcIn0sXCJmXCI6W1wiQ09MTEFCT1JBVElWRSAtIFBMQVlMSVNUUyAtIE9OTElORVwiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInJvd1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sLXhzLTYgY29sLXhzLW9mZnNldC0zXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImZvcm1cIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZm9ybS1ncm91cFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlcm5hbWVcIn1dLFwidHlwZVwiOlwidXNlcm5hbWVcIixcImlkXCI6XCJleGFtcGxlSW5wdXRFbWFpbDFcIixcInBsYWNlaG9sZGVyXCI6XCJVc2VybmFtZVwiLFwiY2xhc3NcIjpcImZvcm0tY29udHJvbFwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmb3JtLWdyb3VwXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwYXNzd29yZFwifV0sXCJ0eXBlXCI6XCJwYXNzd29yZFwiLFwiaWRcIjpcImV4YW1wbGVJbnB1dFBhc3N3b3JkMVwiLFwicGxhY2Vob2xkZXJcIjpcIlBhc3N3b3JkXCIsXCJjbGFzc1wiOlwiZm9ybS1jb250cm9sXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwic3VibWl0XCIsXCJkaXNhYmxlZFwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W10sXCJzXCI6XCJmYWxzZVwifX1dLFwiY2xhc3NcIjpcImJ0biBidG4tZGVmYXVsdFwifSxcInZcIjp7XCJjbGlja1wiOlwic2lnbkluXCJ9LFwiZlwiOltcIlN1Ym1pdFwiXX1dfV19XX1dfV19IiwiaW1wb3J0IGF4aW9zICBmcm9tICdheGlvcydcclxuaW1wb3J0IF8gICAgICBmcm9tICdsb2Rhc2gnXHJcbmltcG9ydCBjb25maWcgZnJvbSAnY29uZmlndXJhdGlvbidcclxuXHJcbmNsYXNzIFBsYXlsaXN0IHtcclxuXHJcbiAgY29uc3RydWN0b3IocGxheWxpc3QpIHtcclxuICAgIF8uZXh0ZW5kICh0aGlzLCBwbGF5bGlzdCk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFwUGxheWxpc3QgKHJlc3BvbnNlKSB7XHJcbiAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuZGF0YSkge1xyXG4gICAgICByZXR1cm4gbmV3IFBsYXlsaXN0KHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHt9O1xyXG4gIH1cclxuXHJcblxyXG5cclxuICAvLyBNYXBzIHRoZSByZXNwb25zZSBkYXRhIGZyb20gdGhlIGFwaSB0byB0aGlzIGF1Z21lbnRlZCBcclxuICAvLyBmcm9udCBlbmQgZG9tYWluIG1vZGVsLlxyXG4gIHN0YXRpYyBtYXBQbGF5bGlzdHMgKHJlc3BvbnNlKSB7XHJcbiAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuZGF0YSkge1xyXG4gICAgICByZXR1cm4gXy5tYXAgKHJlc3BvbnNlLmRhdGEsIChwbGF5bGlzdCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUGxheWxpc3QgKHBsYXlsaXN0KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIHN0YXRpYyBmaW5kKGlkKSB7XHJcbiAgICAgIHJldHVybiBheGlvcy5nZXQoY29uZmlnLmFwaSArICcvcGxheWxpc3RzLycgKyBpZClcclxuICAgICAgICAudGhlbihQbGF5bGlzdC5tYXBQbGF5bGlzdCk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIC8vIFJldHJlaXZlIGFsbCBwbGF5bGlzdHMgZnJvbSB0aGUgQVBJIGFuZCBtYXAgdG8gZGFtYWluIG1vZGVsLlxyXG4gIHN0YXRpYyBmaW5kQWxsKCkge1xyXG4gICAgcmV0dXJuIGF4aW9zLmdldChjb25maWcuYXBpICsgJy9wbGF5bGlzdHMnKVxyXG4gICAgICAudGhlbihQbGF5bGlzdC5tYXBQbGF5bGlzdHMpO1xyXG4gIH1cclxuXHJcbiAgc2F2ZSgpIHtcclxuICAgIGlmKCF0aGlzLm5hbWUpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRnV0dXJlIGZpeCB3b3VsZCBiZSB0byBhdHRhY2ggdXBkYXRlIGxpbmtzIHRvIHJlc291cmNlcyBpbiBiYWNrZW5kIGZvciBtb3JlXHJcbiAgICAvLyBSRVNUZnVsIGJlaGF2aW91ci5cclxuICAgIGlmKHRoaXMuX2lkKSB7XHJcbiAgICAgIHJldHVybiBheGlvcy5wdXQodGhpcy5fbGlua3Muc2VsZi5ocmVmLCB0aGlzKVxyXG4gICAgICAgIC50aGVuKFBsYXlsaXN0Lm1hcFBsYXlsaXN0LCAoZXJyKSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXhpb3MucG9zdChjb25maWcuYXBpICsgJy9wbGF5bGlzdHMnLCB0aGlzKVxyXG4gICAgICAudGhlbihQbGF5bGlzdC5tYXBQbGF5bGlzdCwgKGVycikgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcbiAgfVxyXG5cclxuICBkZWwoKSB7XHJcbiAgICByZXR1cm4gYXhpb3MuZGVsZXRlKHRoaXMuX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQbGF5bGlzdDtcclxuIiwiaW1wb3J0IGF4aW9zICBmcm9tICdheGlvcydcclxuaW1wb3J0IF8gICAgICBmcm9tICdsb2Rhc2gnXHJcbmltcG9ydCBjb25maWcgZnJvbSAnY29uZmlndXJhdGlvbidcclxuXHJcbmNsYXNzIFVzZXIge1xyXG5cclxuICBjb25zdHJ1Y3Rvcih1c2VyKSB7XHJcbiAgICBfLmV4dGVuZCAodGhpcywgdXNlcik7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFwVXNlciAocmVzcG9uc2UpIHtcclxuICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5kYXRhKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVXNlcihyZXNwb25zZS5kYXRhKTtcclxuICAgIH1cclxuICAgIHJldHVybiB7fTtcclxuICB9XHJcblxyXG4gIC8vIE1hcHMgdGhlIHJlc3BvbnNlIGRhdGEgZnJvbSB0aGUgYXBpIHRvIHRoaXMgYXVnbWVudGVkIFxyXG4gIC8vIGZyb250IGVuZCBkb21haW4gbW9kZWwuXHJcbiAgc3RhdGljIG1hcFVzZXJzIChyZXNwb25zZSkge1xyXG4gICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLmRhdGEpIHtcclxuICAgICAgcmV0dXJuIF8ubWFwIChyZXNwb25zZS5kYXRhLCAodXNlcikgPT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgVXNlciAodXNlcik7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcblxyXG4gIHN0YXRpYyBmaW5kKGlkKSB7XHJcbiAgICAgIHJldHVybiBheGlvcy5nZXQoY29uZmlnLmFwaSArICcvdXNlcnMvJyArIGlkKVxyXG4gICAgICAgIC50aGVuKFVzZXIubWFwVXNlcik7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gUmV0cmVpdmUgYWxsIHBsYXlsaXN0cyBmcm9tIHRoZSBBUEkgYW5kIG1hcCB0byBkYW1haW4gbW9kZWwuXHJcbiAgc3RhdGljIGZpbmRBbGwoKSB7XHJcbiAgICByZXR1cm4gYXhpb3MuZ2V0KGNvbmZpZy5hcGkgKyAnL3VzZXJzJylcclxuICAgICAgLnRoZW4oVXNlci5tYXBVc2Vycyk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVXNlcjtcclxuIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwibmF2XCIsXCJhXCI6e1wicm9sZVwiOlwibmF2aWdhdGlvblwiLFwiY2xhc3NcIjpcIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItc3RhdGljLXRvcFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGFpbmVyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJuYXZiYXItaGVhZGVyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCIjL2hvbWVcIixcImNsYXNzXCI6XCJuYXZiYXItYnJhbmRcIn0sXCJmXCI6W1wiUGxheUxpc3RcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcInZcIjp7XCJjbGlja1wiOlwibG9nb3V0XCJ9LFwiYVwiOntcImNsYXNzXCI6XCJidG4gbmF2YmFyLWJ0biBidG4tZGFuZ2VyIHB1bGwtcmlnaHRcIn0sXCJmXCI6W1wiTG9nb3V0XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInBcIixcImFcIjp7XCJjbGFzc1wiOlwibmF2YmFyLXRleHQgcHVsbC1yaWdodFwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLnVzZXJuYW1lXCJ9XX1dfV19XX0iLCJpbXBvcnQgUmFjdGl2ZSBmcm9tICdyYWN0aXZlJztcclxuaW1wb3J0IGh0bWwgZnJvbSAnLi9wbGF5bGlzdC5yYWN0JztcclxuaW1wb3J0IG5hdmJhciBmcm9tICcuLi9uYXZiYXIvbmF2YmFyLnJhY3QnO1xyXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5cclxuY2xhc3MgUGxheWxpc3Qge1xyXG5cclxuICBjb25zdHJ1Y3RvcihhdXRoLCBldmVudHMsIHBsYXlsaXN0U2VydmljZSwgdXNlclNlcnZpY2UpIHtcclxuICAgIHRoaXMuYXhpb3MgICAgPSBheGlvcztcclxuICAgIHRoaXMuYXV0aCAgICAgPSBhdXRoO1xyXG4gICAgdGhpcy5ldmVudHMgICA9IGV2ZW50cztcclxuICAgIHRoaXMucGxheWxpc3RTZXJ2aWNlID0gcGxheWxpc3RTZXJ2aWNlO1xyXG4gICAgdGhpcy51c2VyU2VydmljZSAgPSB1c2VyU2VydmljZTtcclxuICAgIHRoaXMucGxheWxpc3QgPSB7fTtcclxuICB9XHJcblxyXG4gIHJlbmRlcihoYXNoKSB7XHJcblxyXG4gICAgbGV0IHBhdGhzID0gaGFzaC5zcGxpdCgnLycpO1xyXG4gICAgdGhpcy5pZCA9IHBhdGhzW3BhdGhzLmxlbmd0aCAtIDFdO1xyXG4gICAgdGhpcy5sb2dnZWRJblVzZXIgPSB0aGlzLmF1dGgubG9nZ2VkSW5Vc2VyKCk7XHJcblxyXG4gICAgdGhpcy5yYWN0aXZlID0gbmV3IFJhY3RpdmUoe1xyXG4gICAgICBlbDogJyN2aWV3JyxcclxuICAgICAgdGVtcGxhdGU6IGh0bWwsXHJcbiAgICAgIHBhcnRpYWxzOiB7bmF2YmFyOiBuYXZiYXJ9LFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgc2VhcmNoVGVybTogJycsXHJcbiAgICAgICAgdXNlcjogdGhpcy5hdXRoLmxvZ2dlZEluVXNlcigpLFxyXG4gICAgICAgIHVzZXJzOiBbXVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgLy8gRmlsdGVyIG91dCB1c2VycyB0byBhZGQgYXMgY29sbGFib3JhdG9ycyBiYXNlZCBvbiB0aGUgc2VhcmNoIHRlcm1cclxuICAgIHRoaXMucmFjdGl2ZS5vYnNlcnZlKCAnc2VhcmNoVGVybScsICggbmV3VmFsdWUsIG9sZFZhbHVlICkgPT4ge1xyXG4gICAgICBcclxuICAgICAgaWYobmV3VmFsdWUubGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yYWN0aXZlLnNldCgnYWRkRWRpdG9yTGlzdCcsIFtdKVxyXG4gICAgICB9IFxyXG4gICAgICBcclxuICAgICAgbGV0IGZpbHRlcmVkID0gdGhpcy51c2Vycy5maWx0ZXIoKHVzZXIpID0+IHsgXHJcblxyXG4gICAgICAgIC8vIENhbid0IGFkZCB5b3Vyc2VsZiBhcyBhbiBlZGl0b3IuXHJcbiAgICAgICAgaWYodXNlci5faWQgPT0gdGhpcy5sb2dnZWRJblVzZXIuX2lkKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vIENhbid0IGFkZCBzb21lb25lIHdobyBpcyBhbHJlYWR5IGFuIGVkaXRvci5cclxuICAgICAgICBsZXQgYWxyZWFkeUVkaXRvciA9IHRoaXMucGxheWxpc3QuZWRpdG9ycy5zb21lKChlZGl0b3IpID0+IHtcclxuICAgICAgICAgIHJldHVybiB1c2VyLl9pZCA9PSBlZGl0b3IuX2lkXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYoYWxyZWFkeUVkaXRvcikgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAvLyBVc2VyIG5hbWUgbXVzdCBtYXRjaCBzZWFyY2ggcXVlcnlcclxuICAgICAgICByZXR1cm4gbmV3VmFsdWUgPT0gdXNlci51c2VybmFtZS5zdWJzdHJpbmcoMCwgbmV3VmFsdWUubGVuZ3RoKVxyXG5cclxuICAgICAgfSlcclxuICAgICAgXHJcbiAgICAgIHRoaXMucmFjdGl2ZS5zZXQoJ2FkZEVkaXRvckxpc3QnLCBmaWx0ZXJlZClcclxuICAgICAgXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBHZXQgdXNlciBsaXN0IGFuZCBzYXZlIGxvY2FsbHkuXHJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlLmZpbmRBbGwoKS50aGVuKCh1c2VycykgPT4ge1xyXG4gICAgICB0aGlzLnVzZXJzID0gdXNlcnM7XHJcbiAgICAgIHRoaXMucmFjdGl2ZS5zZXQoJ3VzZXJzJywgdGhpcy51c2Vycyk7XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIFVTRSBwbGF5bGlzdFNlcnZpY2UgZmluZCAtIHRvIGdldCB0aGUgY3lsaW5kZXIgZm9yIHRoaXMgdmlldy4gXHJcbiAgICB0aGlzLnBsYXlsaXN0U2VydmljZS5maW5kKHRoaXMuaWQpLnRoZW4oKHBsYXlsaXN0KSA9PiB7XHJcbiAgICAgIFxyXG4gICAgICBsZXQgZWRpdFBlcm1pc3Npb25zID0gdGhpcy5sb2dnZWRJblVzZXIuX2lkID09IHBsYXlsaXN0Lm93bmVySUQ7XHJcbiAgICAgIGVkaXRQZXJtaXNzaW9ucyA9IGVkaXRQZXJtaXNzaW9ucyB8fCBwbGF5bGlzdC5lZGl0b3JzLnNvbWUoKGVkaXRvcikgPT4ge3JldHVybiBlZGl0b3IuX2lkID09IHRoaXMubG9nZ2VkSW5Vc2VyLl9pZH0pXHJcblxyXG4gICAgICB0aGlzLnJhY3RpdmUuc2V0KCdlZGl0UGVybWlzc2lvbnMnLCBlZGl0UGVybWlzc2lvbnMpO1xyXG4gICAgICB0aGlzLnBsYXlsaXN0ID0gcGxheWxpc3Q7XHJcbiAgICAgIHRoaXMucmFjdGl2ZS5zZXQoJ3BsYXlsaXN0JywgdGhpcy5wbGF5bGlzdCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBUbyBBZGQgYW5kIGRlbGV0ZSB0cmFja3Mgc2ltcGx5IG1vZGlmeSB0aGUgcGxheWxpc3QgYW5kIGNhbGwgY3lsaW5kZXJMaXN0U2VydmljZS5zYXZlKHBsYXlsaXN0KTtcclxuICAgIHRoaXMucmFjdGl2ZS5vbignbmV3VHJhY2snLCAoZSwgdXJsKSA9PiB7XHJcbiAgICAgIHRoaXMucGxheWxpc3QudHJhY2tzLnB1c2goe3VybDp1cmx9KTtcclxuICAgICAgdGhpcy5wbGF5bGlzdFNlcnZpY2Uuc2F2ZSh0aGlzLnBsYXlsaXN0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucmFjdGl2ZS5vbignZGVsZXRlVHJhY2snLCAoZSwgaW5kZXgpID0+IHtcclxuICAgICAgdGhpcy5wbGF5bGlzdC50cmFja3Muc3BsaWNlKGluZGV4LDEpO1xyXG4gICAgICB0aGlzLnBsYXlsaXN0U2VydmljZS5zYXZlKHRoaXMucGxheWxpc3QpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHRoaXMucmFjdGl2ZS5vbignYWRkRWRpdG9yJywgKGUsIHVzZXIpID0+IHtcclxuICAgICAgdGhpcy5wbGF5bGlzdC5lZGl0b3JzLnB1c2godXNlci5faWQpXHJcbiAgICAgIHRoaXMucGxheWxpc3RTZXJ2aWNlLnNhdmUodGhpcy5wbGF5bGlzdClcclxuICAgIH0pXHJcblxyXG4gICAgdGhpcy5yYWN0aXZlLm9uKCdsb2dvdXQnLCAoKSA9PiB0aGlzLmxvZ291dCgpKTtcclxuXHJcbiAgfVxyXG5cclxuICBpc1Byb3RlY3RlZCgpe1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBsb2dvdXQoKSB7XHJcbiAgICB0aGlzLmF1dGguY2xlYXJMb2dpbigpO1xyXG4gICAgdGhpcy5ldmVudHMucm91dGluZy50cmFuc2l0aW9uVG8uZGlzcGF0Y2goJ2xvZ2luJywgdGhpcyk7XHJcbiAgfVxyXG5cclxuICB1bnJlbmRlcigpIHtcclxuICAgIHJldHVybiB0aGlzLnJhY3RpdmUudGVhcmRvd24oKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBsYXlsaXN0O1xyXG4iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjgsXCJyXCI6XCJuYXZiYXJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGFpbmVyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJyb3dcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbC14cy0xMlwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMVwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInBsYXlsaXN0Lm5hbWVcIn1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwicm93XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2wtbWQtOSBjb2wteHMtMTJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImFcIjp7XCJjbGFzc1wiOlwidGFibGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGhlYWRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRoXCIsXCJmXCI6W1wiVHJhY2tzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRoXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGhlYWRcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0Ym9keVwiLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpbe1widFwiOjIsXCJyXCI6XCJ1cmxcIn1dfSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJ1cmxcIn1dfV19LHtcInRcIjo0LFwiZlwiOltcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcInR5cGVcIjpcInN1Ym1pdFwiLFwiY2xhc3NcIjpcImdseXBoaWNvbiBnbHlwaGljb24tdHJhc2ggcHVsbC1yaWdodFwifSxcInZcIjp7XCJjbGlja1wiOntcIm5cIjpcImRlbGV0ZVRyYWNrXCIsXCJkXCI6W3tcInRcIjoyLFwiclwiOlwiaW5kZXhcIn1dfX19XX1dLFwiblwiOjUwLFwiclwiOlwiZWRpdFBlcm1pc3Npb25zXCJ9XX1dLFwiblwiOjUyLFwiaVwiOlwiaW5kZXhcIixcInJcIjpcInBsYXlsaXN0LnRyYWNrc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJ0ZXh0XCIsXCJwbGFjZWhvbGRlclwiOlwibmV3IHRyYWNrXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcIm5ld1RyYWNrVXJsXCJ9XSxcImNsYXNzXCI6XCJmb3JtLWNvbnRyb2xcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcInN1Ym1pdFwiLFwiY2xhc3NcIjpcImJ0biBidG4tYmxvY2sgYnRuLXN1Y2Nlc3MgY2VudGVyLWJsb2NrXCJ9LFwidlwiOntcImNsaWNrXCI6e1wiblwiOlwibmV3VHJhY2tcIixcImRcIjpbe1widFwiOjIsXCJyXCI6XCJuZXdUcmFja1VybFwifV19fSxcImZcIjpbXCJBZGRcIl19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlZGl0UGVybWlzc2lvbnNcIn1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sLW1kLTMgY29sLXhzLTEyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImg0XCIsXCJmXCI6W1wiT3duZXJcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxpc3QtZ3JvdXBcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJsaXN0LWdyb3VwLWl0ZW1cIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwib3duZXJcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiaDRcIixcImZcIjpbXCJFZGl0b3JzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsaXN0LWdyb3VwXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcImxpc3QtZ3JvdXAtaXRlbVwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VybmFtZVwifV19XSxcIm5cIjo1MixcInJcIjpcInBsYXlsaXN0LmVkaXRvcnNcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJsaXN0LWdyb3VwLWl0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJ0ZXh0XCIsXCJwbGFjZWhvbGRlclwiOlwiQWRkIGNvbGxhYm9yYXRvcnNcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoVGVybVwifV0sXCJjbGFzc1wiOlwiZm9ybS1jb250cm9sXCJ9fV19XSxcIm5cIjo1MCxcInJcIjpcImVkaXRQZXJtaXNzaW9uc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJuXCI6XCJhZGRFZGl0b3JcIixcImRcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX19LFwiYVwiOntcImNsYXNzXCI6XCJsaXN0LWdyb3VwLWl0ZW1cIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidXNlcm5hbWVcIn1dfV0sXCJuXCI6NTIsXCJyXCI6XCJhZGRFZGl0b3JMaXN0XCJ9XX1dfV19XX1dfSIsImNsYXNzIEF1dGgge1xyXG5cclxuICBjb25zdHJ1Y3RvcihodHRwLCBzdG9yZSwgZXZlbnRzLCBjb25maWcpIHtcclxuICAgIHRoaXMuaHR0cCA9IGh0dHA7XHJcbiAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcclxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gIH1cclxuXHJcbiAgbG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKSB7XHJcbiAgICAvLyBtYWtpbmcgdXNlIG9mIGVzNiBkZXN0cnVjdGluZyBoZXJlXHJcbiAgICBsZXQgcGF5bG9hZCA9ICh1c2VybmFtZSAmJiBwYXNzd29yZCkgPyB7dXNlcm5hbWUsIHBhc3N3b3JkfSA6IHVuZGVmaW5lZDtcclxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLmNvbmZpZy5hcGkgKyAnL3VzZXJzL2xvZ2luJywgcGF5bG9hZCkudGhlbigocmVzcG9uc2UpID0+IHtcclxuXHJcbiAgICAgIGxldCBhY2Nlc3NUb2tlbiA9IHJlc3BvbnNlLmRhdGEuYWNjZXNzVG9rZW47XHJcbiAgICAgIGxldCB1c2VyID0gcmVzcG9uc2UuZGF0YS51c2VyO1xyXG5cclxuICAgICAgdGhpcy5zdG9yZS5sb2NhbC5zZXQoJ2FjY2Vzc1Rva2VuJywgYWNjZXNzVG9rZW4pO1xyXG4gICAgICB0aGlzLnN0b3JlLm1lbW9yeS5zZXQoJ3VzZXInLCB1c2VyKTtcclxuXHJcbiAgICAgIHJldHVybiB1c2VyXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlc3RvcmVMb2dpbigpIHtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuY29uZmlnLmFwaSArICcvdXNlcnMvbG9naW4nKVxyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodGhpcy5jb25maWcuYXBpICsgJy91c2Vycy9sb2dpbicpLnRoZW4oXHJcbiAgICAgICAgKHJlc3BvbnNlKSAgPT4gIHtcclxuICAgICAgICAgIHRoaXMuc3RvcmUubWVtb3J5LnNldCgndXNlcicsIHJlc3BvbnNlLmRhdGEudXNlcik7XHJcbiAgICAgICAgICB0aGlzLmV2ZW50cy5hdXRoLnJlc3RvcmVkTG9naW4uZGlzcGF0Y2gobnVsbCwgcmVzcG9uc2UuZGF0YS51c2VyKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKGVycikgICA9PiB7XHJcbiAgICAgICAgICB0aGlzLmV2ZW50cy5hdXRoLnJlc3RvcmVkTG9naW4uZGlzcGF0Y2goZXJyKTtcclxuICAgICAgICB9KVxyXG4gIH1cclxuXHJcbiAgY2xlYXJMb2dpbigpIHtcclxuICAgIHRoaXMuc3RvcmUubG9jYWwucmVtb3ZlKCdhY2Nlc3NUb2tlbicpO1xyXG4gICAgdGhpcy5zdG9yZS5tZW1vcnkucmVtb3ZlKCd1c2VyJyk7XHJcbiAgfVxyXG5cclxuICBsb2dnZWRJblVzZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdG9yZS5tZW1vcnkuZ2V0KCd1c2VyJyk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBdXRoXHJcbiIsImltcG9ydCBzaWduYWxzIGZyb20gJ3NpZ25hbHMnO1xyXG5cclxuY2xhc3MgRXZlbnRzIHtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBcclxuICAgIHRoaXMuaHR0cCA9IHtcclxuICAgICAgZmFpbGVkUmVxdWVzdDogbmV3IHNpZ25hbHMuU2lnbmFsKClcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5yb3V0aW5nID0ge1xyXG4gICAgICB0cmFuc2l0aW9uVG86IG5ldyBzaWduYWxzLlNpZ25hbCgpLFxyXG4gICAgICBhY2Nlc3NEZW5pZWQ6IG5ldyBzaWduYWxzLlNpZ25hbCgpLFxyXG4gICAgICBub3RGb3VuZDogbmV3IHNpZ25hbHMuU2lnbmFsKClcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5hdXRoID0ge1xyXG4gICAgICByZXN0b3JlZExvZ2luOiBuZXcgc2lnbmFscy5TaWduYWwoKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEV2ZW50cygpO1xyXG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXHJcblxyXG5cclxuY29uc3QgZGVmYXVsdENvbmZpZ3VyYXRpb24gPSB7XHJcbiAgaXNGb3JtVmFsaWQ6ICdwYXJzbGV5VmFsaWQnLFxyXG4gIGZvY3VzOiAnbm9uZScsXHJcbiAgZXJyb3JDbGFzczogJ2hhcy1lcnJvcicsXHJcbiAgc3VjY2Vzc0NsYXNzOiAnaGFzLXN1Y2Nlc3MnLFxyXG4gIGNsYXNzSGFuZGxlcjogZnVuY3Rpb24oUGFyc2xleUZpZWxkKSB7XHJcbiAgICByZXR1cm4gUGFyc2xleUZpZWxkLiRlbGVtZW50LnBhcmVudHMoJy5mb3JtLWdyb3VwJyk7XHJcbiAgfSxcclxuICBlcnJvcnNDb250YWluZXI6IGZ1bmN0aW9uKFBhcnNsZXlGaWVsZCkge1xyXG4gICAgcmV0dXJuIFBhcnNsZXlGaWVsZC4kZWxlbWVudC5wYXJlbnRzKCcuZm9ybS1ncm91cCcpO1xyXG4gIH0sXHJcbiAgZXJyb3JzV3JhcHBlcjogJzxzcGFuIGNsYXNzPVwiaGVscC1ibG9ja1wiPicsXHJcbiAgZXJyb3JUZW1wbGF0ZTogJzxkaXY+PC9kaXY+J1xyXG59O1xyXG5cclxuXHJcbi8vIEEgZGVjb3JhdG9yIGZ1bmN0aW9uIHRha2VzIHR3byBhcmd1bWVudHMuIFRoZSBET00gZWxlbWVudCB0aGUgZGVjb3JhdG9yIHdhcyBjYWxsZWQgZnJvbVxyXG4vLyBhbmQgYW55IGFkZGl0aW9uYWwgYXJndW1lbnRzIGFkZGVkIHRvIHRoZSBkZWNvcmF0b3IgYXR0cmlidXRlIG9mIHRoYXQgZWxlbWVudC5cclxubGV0IHBhcnNsZXlEZWNvcmF0b3IgPSBmdW5jdGlvbihub2RlLCBjb250ZW50KSB7XHJcblxyXG4gIC8vIEhhdmUgbm90IGludmVzdGlnYXRlZCBhbnkgc291cmNlIGNvZGUgYnV0IGNvdWxkbid0IGZpbmQgYW55IGRvY3Mgc3RhdGluZyBjb250ZXh0XHJcbiAgLy8gb2YgaW52b2NhdGlvbiB3YXMgcmFjdGl2ZSBsaWJyYXJ5IEJVVCBzZWVtcyB0byB3b3JrLlxyXG4gIGxldCByYWN0aXZlID0gdGhpcztcclxuICBcclxuICAvLyB1c2UgcmFjdGl2ZSB0byBzZXQgdGhlIGRhdGEgbW9kZWwuIEluaXRpYWxseSBmb3JtIGlzIG5vdCB2YWxpZC4gXHJcbiAgcmFjdGl2ZS5zZXQocGFyc2xleURlY29yYXRvci5jb25maWcuaXNGb3JtVmFsaWQsIGZhbHNlKTtcclxuXHJcbiAgLy8gV2hlbiBwYXJzbGV5IGxvYWRzIGl0IHJlZ2lzdGVycyBpdHNlbGYgd2l0aCBqcXVlcnkgYW5kIGFkZHMgYSBwYXJzbGV5IGZ1bmN0aW9uLlxyXG4gIC8vIHRoaXMgZnVuY3Rpb24gY3JlYXRlcyBhIG5ldyBQYXJzbGV5RmFjdG9yeSBmcm9tIHRoZSBKUSBlbGVtZW50IGFuZCB0aGUgZXh0cmEgYXJndW1lbnRcclxuICAvLyBwYXNzZWQgZGlyZWN0bHkuXHJcbiAgbGV0IHBhcnNsZXlGb3JtID0gJChub2RlKS5wYXJzbGV5KHBhcnNsZXlEZWNvcmF0b3IuY29uZmlnKVxyXG5cclxuICAvLyBHZXRzIGFsbCB0aGUgaW5wdXQgZWxlbWVudHMgb2YgdGhlIGZvcm0uXHJcbiAgbGV0IGlucHV0RmllbGRzID0gJChub2RlKS5jaGlsZHJlbignLmZvcm0tZ3JvdXAnKS5jaGlsZHJlbignaW5wdXQnKSB8fCBbXVxyXG5cclxuICAvLyBGdW5jdGlvbiB0aGF0IHZhbGlkYXRlcyB0aGUgZnJvbSBhbmQgc2V0cyB0aGUgJ3BhcnNsZXlWYWxpZCcgbW9kZWwuXHJcbiAgZnVuY3Rpb24gdmFsaWRhdGUoKSB7XHJcbiAgICByYWN0aXZlLnNldChwYXJzbGV5RGVjb3JhdG9yLmNvbmZpZy5pc0Zvcm1WYWxpZCwgcGFyc2xleUZvcm0udmFsaWRhdGUoKSk7XHJcbiAgfVxyXG5cclxuICAvLyBhdHRhY2hlcyBhIGNhbGxiYWNrIHRvIHZhbGlkYXRlIHRoZSBmb3JtIHdoZW5ldmVyIHRoZSAnYmx1cicgb3IgJ2tleXVwJyBldmVudCBvY2N1clxyXG4gIC8vIGZvciBlYWNoIGlucHV0IGZpZWxkLlxyXG4gIF8uZm9yRWFjaChpbnB1dEZpZWxkcywgZWxlbSA9PiB7XHJcbiAgICAvLyBUaGUgYmx1ciBldmVudCBpcyBzZW50IHRvIGFuIGVsZW1lbnQgd2hlbiBpdCBsb3NlcyBmb2N1cy5cclxuICAgICQoZWxlbSkuYmx1cih2YWxpZGF0ZSk7XHJcbiAgICAkKGVsZW0pLmtleXVwKHZhbGlkYXRlKTtcclxuICB9KTtcclxuXHJcbiAgLy8gUmFjdGl2ZSByZXF1aXJlcyBkZWNvcmF0b3JzIHRvIHJldHVybiBhIHRlYXJkb3duIGZ1bmN0aW9uLiBUaGVcclxuICAvLyB0ZWFyZG93biBmdW5jdGlvbnMgZGVmaW5lcyBhbnkgYWN0aW9uIHJlcXVpcmVkIGlmIHRoZSBET00gZWxlbWVudFxyXG4gIC8vIGlzIHJlbW92ZWQuXHJcbiAgcmV0dXJuIHtcclxuICAgIHRlYXJkb3duOiBmdW5jdGlvbigpe1xyXG4gICAgICAvLyB1bmJpbmQgcmVtb3ZlcyBldmVudCBoYW5kbGVycy5cclxuICAgICAgXy5mb3JFYWNoKGlucHV0RmllbGRzLCBlbGVtID0+ICgkZWxlbSkudW5iaW5kKCkpO1xyXG4gICAgICBwYXJzbGV5Rm9ybS5kZXN0cm95KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxuLy8gQmVzdCBwcmFjdGlzZSB0byBhc3NpZ24gYW55IGRlY29yYXRvciB2YXJpYWJsZXMgYnkgYXR0YWNoaW5nIHRoZW0gdG8gdGhlIGZ1bmN0aW9uIFxyXG4vLyByYXRoZXIgdGhhbiBhZGRpbmcgdGhlbSBhcyBhIGxvbmcgc3RyaW5nIG9mIGFyZ3VtZW50cyB0byB0aGUgZGVjb3JhdG9yIGluIHRoZSBodG1sXHJcbnBhcnNsZXlEZWNvcmF0b3IuY29uZmlnID0gZGVmYXVsdENvbmZpZ3VyYXRpb247XHJcbmV4cG9ydCBkZWZhdWx0IHBhcnNsZXlEZWNvcmF0b3I7XHJcbiIsImltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5jbGFzcyBQbGF5bGlzdFNlcnZpY2Uge1xyXG5cclxuICAvLyBQYXNzIHRoZSBkb21haW4gbW9kZWwgZm9yIHBsYXlsaXN0cy4gXHJcbiAgY29uc3RydWN0b3IoUGxheWxpc3QpIHtcclxuICAgIHRoaXMuUGxheWxpc3QgPSBQbGF5bGlzdDtcclxuICB9XHJcblxyXG4gIGZpbmQgKGlkKSB7XHJcbiAgICByZXR1cm4gdGhpcy5QbGF5bGlzdC5maW5kKGlkKTtcclxuICB9XHJcblxyXG4gIGZpbmRBbGwgKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuUGxheWxpc3QuZmluZEFsbCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gRmluZCBhbGwgcGxheWxpc3RzIGJlbG9uZ2luZyB0byBjdXJyZW50bHkgbG9nZ2VkIGluIHVzZXJcclxuICBmaW5kUGVyc29uYWwgKHVzZXJJZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZmluZEFsbCgpLnRoZW4oKHBsYXlsaXN0cykgPT4ge1xyXG4gICAgICByZXR1cm4gXy5maWx0ZXIocGxheWxpc3RzLCB7b3duZXJJRDogdXNlcklkfSkgIFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIC8vIEZpbmQgYWxsIHB1YmxpYyBwbGF5bGlzdHMgKHRob3NlIHdoaWNoIGxvZ2dlZCBpbiB1c2VyIGRvZXMgbm90IG93bilcclxuICBmaW5kUHVibGljICh1c2VySWQpIHtcclxuICAgIHJldHVybiB0aGlzLmZpbmRBbGwoKS50aGVuKChwbGF5bGlzdHMpID0+IHtcclxuICAgICAgcmV0dXJuIF8uZmlsdGVyKHBsYXlsaXN0cywgKHBsKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHBsLm93bmVySUQgIT0gdXNlcklkO1xyXG4gICAgICB9KSAgXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgLy8gQ3JlYXRlIGFuZCByZXR1cm4gYSBuZXcgcGxheWxpc3QuXHJcbiAgYWRkIChwbGF5bGlzdCkge1xyXG4gICAgcGxheWxpc3QgPSBuZXcgdGhpcy5QbGF5bGlzdChwbGF5bGlzdCk7XHJcbiAgICByZXR1cm4gcGxheWxpc3Quc2F2ZSAoKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZSAocGxheWxpc3QpIHtcclxuICAgIHJldHVybiBwbGF5bGlzdCAmJiBwbGF5bGlzdC5kZWwoKTtcclxuICB9XHJcblxyXG4gIHNhdmUgKHBsYXlsaXN0KSB7XHJcbiAgICByZXR1cm4gcGxheWxpc3QgJiYgcGxheWxpc3Quc2F2ZSgpO1xyXG4gIH1cclxuICBcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUGxheWxpc3RTZXJ2aWNlO1xyXG4iLCJpbXBvcnQgY3Jvc3Nyb2FkcyBmcm9tICdjcm9zc3JvYWRzJztcclxuaW1wb3J0IGhhc2hlciBmcm9tICdoYXNoZXInO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuY2xhc3MgUm91dGVyIHtcclxuXHJcbiAgY29uc3RydWN0b3IoYXV0aCwgZXZlbnRzKSB7XHJcbiAgICB0aGlzLmF1dGggPSBhdXRoO1xyXG4gICAgdGhpcy5ldmVudHMgPSBldmVudHM7XHJcbiAgfVxyXG5cclxuICBpbml0aWFsaXNlKCkge1xyXG4gICAgLy8gbG9va3MgbGlrZSBoYXNoZXIgd2F0Y2hlcyBoYXNoIGFuZCBlbWl0cyBzaWduYWxzXHJcbiAgICAvLyBIZXJlIHdlIGRlY2xhcmUgaG93IHRvIGhhbmRsZSBpbml0aWFsIGhhc2ggYW5kIGFueVxyXG4gICAgLy8gZnVydGhlciBjaGFuZ2VzLlxyXG4gICAgaGFzaGVyLmluaXRpYWxpemVkLmFkZCh0aGlzLnBhcnNlSGFzaCk7XHJcbiAgICBoYXNoZXIuY2hhbmdlZC5hZGQodGhpcy5wYXJzZUhhc2gpO1xyXG4gICAgaGFzaGVyLmluaXQoKTtcclxuXHJcbiAgICAvLyBieXBhc3NlZCBjYWxsYmFja3MgYXJlIHJ1biBldmVyeXRpbWUgYSByb3V0ZSBjdW9sZCBub3QgYmUgZm91bmQgdG8gbWF0Y2ggdGhlIHJlcXVlc3QuXHJcbiAgICAvLyBXcml0aW5nIGxpa2UgdGhpcyBjYXB0dXJlIHRoaXMgaW4gdGhlIGNsb3N1cmU/XHJcbiAgICBjcm9zc3JvYWRzLmJ5cGFzc2VkLmFkZCgoKSA9PiB0aGlzLmJ5cGFzc2VkSGFuZGxlcigpKTtcclxuICB9XHJcblxyXG4gIGFkZFJvdXRlKHBhdGgsIHZpZXcpIHtcclxuICAgIC8vIGFkZFJvdXRlIG1ldGhvZCB0byByZWdpc3RlciBhIGhhbmRsZXIgdG8gYSBwYXRoLiBcclxuICAgIC8vIEhlcmUsIF8uYmluZCBzZXRzIHRoZSBmdW5jdGlvbiBpbnZvY2F0aW9uIGNvbnRleHQgKHRoaXMpIG9mIHZpZXcucmVuZGVyIHRvIHZpZXdcclxuICAgIFxyXG4gICAgdmlldy5yZW5kZXJfaCA9ICgpID0+IHtcclxuICAgICAgdmlldy5yZW5kZXIoaGFzaGVyLmdldEhhc2goKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGxldCByb3V0ZSA9IGNyb3Nzcm9hZHMuYWRkUm91dGUocGF0aCwgXy5iaW5kKHZpZXcucmVuZGVyX2gsIHZpZXcpKTtcclxuICAgIFxyXG4gICAgLy8gQXR0YWNoIGEgaGFuZGxlciBmb3IgdGhlIHN3aXRjaCBldmVudFxyXG4gICAgcm91dGUubWF0Y2hlZC5hZGQoKCkgPT4gdGhpcy5tYXRjaGVkSGFuZGxlcihwYXRoLCB2aWV3KSk7XHJcbiAgICByb3V0ZS5zd2l0Y2hlZC5hZGQoKCkgPT4gdGhpcy5zd2l0Y2hlZEhhbmRsZXIodmlldykpO1xyXG4gIH1cclxuXHJcbiAgYnlwYXNzZWRIYW5kbGVyKCl7XHJcbiAgICB0aGlzLmV2ZW50cy5yb3V0aW5nLm5vdEZvdW5kLmRpc3BhdGNoKCk7XHJcbiAgfVxyXG5cclxuICBzd2l0Y2hlZEhhbmRsZXIodmlldykge1xyXG4gICAgdmlldy51bnJlbmRlcigpO1xyXG4gIH1cclxuXHJcbiAgbWF0Y2hlZEhhbmRsZXIocGF0aCwgdmlldykge1xyXG4gICAgaWYodmlldy5pc1Byb3RlY3RlZCgpICYmICF0aGlzLmF1dGgubG9nZ2VkSW5Vc2VyKCkpIHtcclxuICAgICAgdmlldy51bnJlbmRlcigpLnRoZW4oKCkgPT4gdGhpcy5ldmVudHMucm91dGluZy5hY2Nlc3NEZW5pZWQuZGlzcGF0Y2gocGF0aCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcGFyc2VIYXNoKG5ld0hhc2gsIG9sZEhhc2gpIHtcclxuICAgIC8vIFdoZW5ldmVyIHRoZSBoYXNoIGNoYW5nZXMgY3Jvc3Nyb2FkcyB3aWxsIHBlcmZvcm0gcm91dGluZ1xyXG4gICAgLy8gYmFzZWQgb24gY29uZmlndXJlZCByb3V0ZXMuIFJlbmRlcmluZyBhbmQgdGVhcmluZyBkb3duIHBhZ2VzLlxyXG4gICAgY3Jvc3Nyb2Fkcy5wYXJzZShuZXdIYXNoKVxyXG4gIH1cclxuXHJcbiAgY3VycmVudEhhc2goKSB7XHJcbiAgICByZXR1cm4gaGFzaGVyLmdldEhhc2goKTtcclxuICB9XHJcblxyXG4gIHRyYW5zaXRpb25UbyhwYXRoKXtcclxuICAgIGhhc2hlci5zZXRIYXNoKHBhdGgpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUm91dGVyXHJcbiIsImltcG9ydCBzdG9yZSBmcm9tICdzdG9yZSc7XHJcblxyXG5jbGFzcyBJbk1lbW9yeSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zdG9yZSA9IHt9XHJcbiAgfVxyXG5cclxuICBzZXQoa2V5LCB2YWx1ZSkge1xyXG4gICAgdGhpcy5zdG9yZVtrZXldID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQoa2V5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdG9yZVtrZXldO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlKGtleSkge1xyXG4gICAgZGVsZXRlIHRoaXMuc3RvcmVba2V5XTtcclxuICB9XHJcblxyXG59XHJcblxyXG5jbGFzcyBMb2NhbCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG4gIH1cclxuXHJcbiAgc2V0KGtleSwgdmFsdWUpIHtcclxuICAgIHRoaXMuc3RvcmUuc2V0KGtleSwgdmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0KGtleSkge1xyXG4gICAgcmV0dXJuIHRoaXMuc3RvcmUuZ2V0KGtleSk7XHJcbiAgfVxyXG5cclxuICByZW1vdmUoa2V5KSB7XHJcbiAgICB0aGlzLnN0b3JlLnJlbW92ZShrZXkpO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgU3RvcmFnZSB7XHJcbiAgXHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgIHRoaXMubG9jYWwgPSBuZXcgTG9jYWwoKTtcclxuICAgIHRoaXMubWVtb3J5ID0gbmV3IEluTWVtb3J5KCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgU3RvcmFnZTtcclxuIiwiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmNsYXNzIFVzZXJTZXJ2aWNlIHtcclxuXHJcbiAgLy8gUGFzcyB0aGUgZG9tYWluIG1vZGVsIGZvciBwbGF5bGlzdHMuIFxyXG4gIGNvbnN0cnVjdG9yKFVzZXIpIHtcclxuICAgIHRoaXMuVXNlciA9IFVzZXI7XHJcbiAgfVxyXG5cclxuICBmaW5kIChpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuVXNlci5maW5kKGlkKTtcclxuICB9XHJcblxyXG4gIGZpbmRBbGwgKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuVXNlci5maW5kQWxsKCk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVXNlclNlcnZpY2U7XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBhcGk6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpJ1xyXG59XHJcblxyXG4iXX0=
