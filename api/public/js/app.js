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

var _socketIoClient = require('socket.io-client');

var _socketIoClient2 = _interopRequireDefault(_socketIoClient);

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

var socket = _socketIoClient2['default'].connect('http://localhost:3000');

router.addRoute('login', new _loginLoginEs62['default'](auth, _servicesEventsEs62['default'], socket));
router.addRoute('home', new _homeHomeEs62['default'](auth, _servicesEventsEs62['default'], plService, socket));
router.addRoute('playlist/{id}', new _playlistPlaylistEs62['default'](auth, _servicesEventsEs62['default'], plService, uService, socket));
router.addRoute('404', new _es62['default']());

// First thing on page load (before trying to route to the current hash) is to establish if the user
// is logged in, and if not, whether they should be directed somewhere else first.
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

},{"./404/404.es6":1,"./home/home.es6":4,"./login/login.es6":6,"./models/playlist.es6":8,"./models/user.es6":9,"./playlist/playlist.es6":11,"./services/auth.es6":13,"./services/events.es6":14,"./services/parsley-decorator.es6":15,"./services/playlistService.es6":16,"./services/router.es6":17,"./services/storage.es6":18,"./services/userService.es6":19,"axios":"axios","configuration":"configuration","logdown":"logdown","parsleyjs":"parsleyjs","ractive":"ractive","socket.io-client":"socket.io-client"}],4:[function(require,module,exports){
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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Home = (function () {
  function Home(auth, events, playlistService, socket) {
    _classCallCheck(this, Home);

    this.auth = auth;
    this.events = events;
    this.playlists = [];
    this.playlistService = playlistService;
    this.socket = socket;
  }

  _createClass(Home, [{
    key: 'render',
    value: function render(hash) {
      var _this = this;

      this.loggedInUser = this.auth.loggedInUser();
      this.ractive = new _ractive2['default']({
        el: '#view',
        template: _homeRact2['default'],
        partials: { navbar: _navbarNavbarRact2['default'] },
        data: {
          user: this.loggedInUser
        }
      });

      this.ractive.on('addPlaylist', function (e, name) {
        _this.playlistService.add({ name: name });
      });

      this.ractive.on('delPlaylist', function (e, playlist) {
        _this.playlistService.remove(playlist);
      });

      this.ractive.on('logout', function () {
        return _this.logout();
      });

      this.socket.on('saved-playlist', function (pl) {
        return _this.changedPlaylist(pl);
      });
      this.socket.on('del-playlist', function (pl) {
        return _this.deletePlaylist(pl);
      });

      this.playlistService.findAll(this.loggedInUser._id).then(function (playlists) {
        _this.playlists = playlists;
        _this.ractive.set('playlists', _this.playlists);
      });
    }
  }, {
    key: 'changedPlaylist',
    value: function changedPlaylist(pl) {
      var _this2 = this;

      this.playlistService.find(pl._id, this.loggedInUser._id).then(function (fullPl) {
        var thisPl = _lodash2['default'].find(_this2.playlists, { _id: pl._id });

        // If the playlist already exists it must be removed. (otherwise it is new)
        if (thisPl) {
          _this2.playlists.splice(_lodash2['default'].indexOf(thisPl), 1);
        }
        _this2.playlists.push(fullPl);
      });
    }
  }, {
    key: 'deletePlaylist',
    value: function deletePlaylist(pl) {
      var index = _lodash2['default'].indexOf(_lodash2['default'].find(this.playlists, { _id: pl._id }));
      this.playlists.splice(index, 1);
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

},{"../navbar/navbar.ract":10,"./home.ract":5,"lodash":"lodash","ractive":"ractive"}],5:[function(require,module,exports){
module.exports={"v":3,"t":[{"t":8,"r":"navbar"}," ",{"t":7,"e":"div","a":{"class":"container"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-xs-12"},"f":[{"t":7,"e":"h3","f":["Your playlists"]}," ",{"t":7,"e":"table","a":{"class":"table"},"f":[{"t":7,"e":"thead","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th","f":["Name"]}," ",{"t":7,"e":"th"}]}]}," ",{"t":7,"e":"tbody","f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"a","a":{"href":["#/playlist/",{"t":2,"r":"_id"}]},"f":[{"t":2,"r":"name"}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","a":{"aria-hidden":"true","class":"glyphicon glyphicon-trash pull-right"},"v":{"click":{"n":"delPlaylist","d":[{"t":2,"r":"."}]}}}]}]}],"n":50,"r":"isOwner"}],"n":52,"r":"playlists"}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"input","a":{"type":"text","placeholder":"new list","value":[{"t":2,"r":"newListName"}],"class":"form-control"}}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"button","a":{"type":"submit","class":"btn btn-block btn-success center-block"},"v":{"click":{"n":"addPlaylist","d":[{"t":2,"r":"newListName"}]}},"f":["Add"]}]}]}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-xs-12"},"f":[{"t":7,"e":"h3","f":["Playlists by others"]}," ",{"t":7,"e":"table","a":{"class":"table"},"f":[{"t":7,"e":"thead","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th","f":["Name"]}]}]}," ",{"t":7,"e":"tbody","f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"a","a":{"href":["#/playlist/",{"t":2,"r":"_id"}]},"f":[{"t":2,"r":"name"}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"aria-hidden":"true","class":"glyphicon glyphicon-star-empty pull-right"}}],"n":50,"r":"isEditor"}]}]}]}],"n":50,"x":{"r":["isOwner"],"s":"!_0"}}],"n":52,"r":"playlists"}]}]}]}]}]}]}
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
  function Login(auth, events, socket) {
    _classCallCheck(this, Login);

    this.auth = auth;
    this.events = events;
    this.socket = socket;
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
module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"container"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"style":"padding: 50px 0;","class":"col-xs-6 col-xs-offset-3"},"f":[{"t":7,"e":"h1","a":{"style":"text-align:center;"},"f":["Welcome To Playlist"]}," ",{"t":7,"e":"h4","a":{"style":"text-align:center;"},"f":["COLLABORATIVE - PLAYLISTS - ONLINE"]}]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-xs-6 col-xs-offset-3"},"f":[{"t":7,"e":"form","f":[{"t":7,"e":"div","a":{"class":"form-group"},"f":[{"t":7,"e":"input","a":{"value":[{"t":2,"r":"username"}],"type":"username","id":"exampleInputEmail1","placeholder":"Username","class":"form-control"}}]}," ",{"t":7,"e":"div","a":{"class":"form-group"},"f":[{"t":7,"e":"input","a":{"value":[{"t":2,"r":"password"}],"type":"password","id":"exampleInputPassword1","placeholder":"Password","class":"form-control"}}]}," ",{"t":7,"e":"button","a":{"type":"submit","disabled":[{"t":2,"x":{"r":[],"s":"false"}}],"class":"btn btn-default"},"v":{"click":"signIn"},"f":["Submit"]}]}]}]}]}]}
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
module.exports={"v":3,"t":[{"t":7,"e":"nav","a":{"role":"navigation","class":"navbar navbar-default navbar-static-top"},"f":[{"t":7,"e":"div","a":{"class":"container"},"f":[{"t":7,"e":"div","a":{"class":"navbar-header"},"f":[{"t":7,"e":"button","a":{"type":"button","data-toggle":"collapse","data-target":"#collapse-1","aria-expanded":"false","class":"navbar-toggle collapsed"},"f":[{"t":7,"e":"span","a":{"class":"sr-only"},"f":["Toggle navigation"]},{"t":7,"e":"span","a":{"class":"icon-bar"}},{"t":7,"e":"span","a":{"class":"icon-bar"}},{"t":7,"e":"span","a":{"class":"icon-bar"}}]},{"t":7,"e":"a","a":{"href":"#/home","class":"navbar-brand"},"f":["PlayList"]}]}," ",{"t":7,"e":"div","a":{"id":"collapse-1","class":"collapse navbar-collapse"},"f":[{"t":7,"e":"button","v":{"click":"logout"},"a":{"class":"btn navbar-btn btn-danger pull-right"},"f":["Logout"]}," ",{"t":7,"e":"p","a":{"class":"navbar-text pull-right"},"f":[{"t":2,"r":"user.username"}]}]}]}]}]}
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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Playlist = (function () {
  function Playlist(auth, events, playlistService, userService, socket) {
    _classCallCheck(this, Playlist);

    this.axios = _axios2['default'];
    this.auth = auth;
    this.events = events;
    this.socket = socket;
    this.playlistService = playlistService;
    this.userService = userService;
    this.player = {};
    this.playlist = {};
    this.currentVid = 0;
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

          // Can't add someone who is already an editor.
          var alreadyEditor = _this.playlist.editors.some(function (editor) {
            return user._id == editor._id;
          });

          // Can't add yourself or someone who is already an editor
          if (alreadyEditor || user._id == _this.loggedInUser._id) return false;

          // User name must match search query
          return _lodash2['default'].contains(user.username, newValue);
        });

        _this.ractive.set('addEditorList', filtered);
      });

      // Get user list and save locally.
      this.userService.findAll().then(function (users) {
        _this.users = users;
        _this.ractive.set('users', _this.users);
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
        _this.playlist.editors.push(user);
        _this.playlistService.save(_this.playlist);
      });

      this.ractive.on('logout', function () {
        return _this.logout();
      });

      this.socket.on('saved-playlist', function (pl) {
        return _this.savedPlaylist(pl);
      });
      this.socket.on('del-playlist', function (pl) {
        return console.log('go to sorry page');
      });

      this.getPlaylist(this.id);

      var readyInt = setInterval(function () {
        var self = _this;
        if (YT) {
          _this.player = new YT.Player('player', {
            height: '293',
            width: '480',
            events: {
              'onReady': function onReady(event) {
                event.target.playVideo();
                self.player.cueVideoById(self.playlist.tracks[self.currentVid].videoId);
                self.player.playVideo();
              },
              'onStateChange': function onStateChange(event) {
                if (event.data == YT.PlayerState.ENDED) {
                  console.log('ENDED');
                  self.currentVid++;
                  self.player.cueVideoById(self.playlist.tracks[self.currentVid].videoId);
                  self.player.playVideo();
                }
              }
            }
          });
          clearInterval(readyInt);
        }
      }, 500);
    }
  }, {
    key: 'savedPlaylist',
    value: function savedPlaylist(pl) {
      if (pl._id == this.playlist._id) {
        this.getPlaylist(pl._id);
      }
    }
  }, {
    key: 'getPlaylist',
    value: function getPlaylist(id) {
      var _this2 = this;

      this.playlistService.find(id, this.loggedInUser._id).then(function (playlist) {
        console.log(playlist);
        _this2.playlist = playlist;
        _this2.ractive.set('playlist', _this2.playlist);
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

},{"../navbar/navbar.ract":10,"./playlist.ract":12,"axios":"axios","lodash":"lodash","ractive":"ractive"}],12:[function(require,module,exports){
module.exports={"v":3,"t":[{"t":8,"r":"navbar"}," ",{"t":7,"e":"div","a":{"class":"container"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-xs-12"},"f":[{"t":7,"e":"h1","f":[{"t":2,"r":"playlist.name"}]}]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-xs-12 col-md-8 col-md-offset-2"},"f":[{"t":7,"e":"div","a":{"class":"embed-responsive embed-responsive-16by9"},"f":[{"t":7,"e":"div","a":{"class":"embed-responsive-item"},"f":[{"t":7,"e":"div","a":{"id":"player"}}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-md-9 col-xs-12"},"f":[{"t":7,"e":"table","a":{"class":"table"},"f":[{"t":7,"e":"thead","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th","f":["Tracks"]}," ",{"t":7,"e":"th"}]}," ",{"t":7,"e":"tr"}]}," ",{"t":7,"e":"thead"}," ",{"t":7,"e":"tbody","f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"a","a":{"href":[{"t":2,"r":"url"}]},"f":[{"t":4,"f":[{"t":2,"r":"title"}],"n":50,"r":"title"},{"t":4,"n":51,"f":[{"t":2,"r":"url"}],"r":"title"}]}]},{"t":4,"f":[" ",{"t":7,"e":"td","f":[{"t":7,"e":"span","a":{"type":"submit","class":"glyphicon glyphicon-trash pull-right"},"v":{"click":{"n":"deleteTrack","d":[{"t":2,"r":"index"}]}}}]}],"n":50,"x":{"r":["playlist.isOwner","playlist.isEditor"],"s":"_0||_1"}}]}],"n":52,"i":"index","r":"playlist.tracks"}," ",{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"input","a":{"type":"text","placeholder":"new track","value":[{"t":2,"r":"newTrackUrl"}],"class":"form-control"}}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"button","a":{"type":"submit","class":"btn btn-block btn-success center-block"},"v":{"click":{"n":"newTrack","d":[{"t":2,"r":"newTrackUrl"}]}},"f":["Add"]}]}]}],"n":50,"x":{"r":["playlist.isOwner","playlist.isEditor"],"s":"_0||_1"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"col-md-3 col-xs-12"},"f":[{"t":7,"e":"h4","f":["Owner"]}," ",{"t":7,"e":"div","a":{"class":"list-group"},"f":[{"t":7,"e":"a","a":{"class":"list-group-item"},"f":[{"t":2,"r":"playlist.owner.username"}]}]}," ",{"t":7,"e":"h4","f":["Editors"]}," ",{"t":7,"e":"div","a":{"class":"list-group"},"f":[{"t":4,"f":[{"t":7,"e":"a","a":{"class":"list-group-item"},"f":[{"t":2,"r":"username"}]}],"n":52,"r":"playlist.editors"}," ",{"t":4,"f":[{"t":7,"e":"a","a":{"class":"list-group-item"},"f":[{"t":7,"e":"input","a":{"type":"text","placeholder":"Add collaborators","value":[{"t":2,"r":"searchTerm"}],"class":"form-control"}}]}],"n":50,"x":{"r":["playlist.isOwner","playlist.isEditor"],"s":"_0||_1"}}," ",{"t":4,"f":[{"t":7,"e":"a","v":{"click":{"n":"addEditor","d":[{"t":2,"r":"."}]}},"a":{"class":"list-group-item"},"f":[{"t":2,"r":"username"}]}],"n":52,"r":"addEditorList"}]}]}]}]}," ",{"t":7,"e":"script","f":["  var tag = document.createElement('script');\n  \n  tag.src = \"https://www.youtube.com/iframe_api\";\n  var firstScriptTag = document.getElementsByTagName('script')[0];\n  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);"]}]}
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
    value: function find(id, uid) {
      var _this = this;

      return this.Playlist.find(id).then(function (playlist) {
        return _this.setPermissions(playlist, uid);
      });
    }
  }, {
    key: 'findAll',
    value: function findAll(uid) {
      var _this2 = this;

      return this.Playlist.findAll().then(function (playlists) {
        return _lodash2['default'].map(playlists, function (pl) {
          return _this2.setPermissions(pl, uid);
        });
      });
    }
  }, {
    key: 'setPermissions',
    value: function setPermissions(pl, uid) {
      if (pl.owner._id == uid) {
        pl.isOwner = true;
      }
      if (_lodash2['default'].find(pl.editors, { _id: uid })) {
        pl.isEditor = true;
      }
      return pl;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9qYXRoL3Byb2plY3RzL3BsYXlsaXN0LmpzL3dlYi1jbGllbnQvc3JjL2pzLzQwNC80MDQuZXM2Iiwic3JjL2pzLzQwNC80MDQucmFjdCIsIkM6L1VzZXJzL2phdGgvcHJvamVjdHMvcGxheWxpc3QuanMvd2ViLWNsaWVudC9zcmMvanMvYXBwLmVzNiIsIkM6L1VzZXJzL2phdGgvcHJvamVjdHMvcGxheWxpc3QuanMvd2ViLWNsaWVudC9zcmMvanMvaG9tZS9ob21lLmVzNiIsInNyYy9qcy9ob21lL2hvbWUucmFjdCIsIkM6L1VzZXJzL2phdGgvcHJvamVjdHMvcGxheWxpc3QuanMvd2ViLWNsaWVudC9zcmMvanMvbG9naW4vbG9naW4uZXM2Iiwic3JjL2pzL2xvZ2luL2xvZ2luLnJhY3QiLCJDOi9Vc2Vycy9qYXRoL3Byb2plY3RzL3BsYXlsaXN0LmpzL3dlYi1jbGllbnQvc3JjL2pzL21vZGVscy9wbGF5bGlzdC5lczYiLCJDOi9Vc2Vycy9qYXRoL3Byb2plY3RzL3BsYXlsaXN0LmpzL3dlYi1jbGllbnQvc3JjL2pzL21vZGVscy91c2VyLmVzNiIsInNyYy9qcy9uYXZiYXIvbmF2YmFyLnJhY3QiLCJDOi9Vc2Vycy9qYXRoL3Byb2plY3RzL3BsYXlsaXN0LmpzL3dlYi1jbGllbnQvc3JjL2pzL3BsYXlsaXN0L3BsYXlsaXN0LmVzNiIsInNyYy9qcy9wbGF5bGlzdC9wbGF5bGlzdC5yYWN0IiwiQzovVXNlcnMvamF0aC9wcm9qZWN0cy9wbGF5bGlzdC5qcy93ZWItY2xpZW50L3NyYy9qcy9zZXJ2aWNlcy9hdXRoLmVzNiIsIkM6L1VzZXJzL2phdGgvcHJvamVjdHMvcGxheWxpc3QuanMvd2ViLWNsaWVudC9zcmMvanMvc2VydmljZXMvZXZlbnRzLmVzNiIsIkM6L1VzZXJzL2phdGgvcHJvamVjdHMvcGxheWxpc3QuanMvd2ViLWNsaWVudC9zcmMvanMvc2VydmljZXMvcGFyc2xleS1kZWNvcmF0b3IuZXM2IiwiQzovVXNlcnMvamF0aC9wcm9qZWN0cy9wbGF5bGlzdC5qcy93ZWItY2xpZW50L3NyYy9qcy9zZXJ2aWNlcy9wbGF5bGlzdFNlcnZpY2UuZXM2IiwiQzovVXNlcnMvamF0aC9wcm9qZWN0cy9wbGF5bGlzdC5qcy93ZWItY2xpZW50L3NyYy9qcy9zZXJ2aWNlcy9yb3V0ZXIuZXM2IiwiQzovVXNlcnMvamF0aC9wcm9qZWN0cy9wbGF5bGlzdC5qcy93ZWItY2xpZW50L3NyYy9qcy9zZXJ2aWNlcy9zdG9yYWdlLmVzNiIsIkM6L1VzZXJzL2phdGgvcHJvamVjdHMvcGxheWxpc3QuanMvd2ViLWNsaWVudC9zcmMvanMvc2VydmljZXMvdXNlclNlcnZpY2UuZXM2IiwiQzovVXNlcnMvamF0aC9wcm9qZWN0cy9wbGF5bGlzdC5qcy93ZWItY2xpZW50L2NvbmZpZy1kZXYuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O3VCQ0FvQixTQUFTOzs7O29CQUNaLFlBQVk7Ozs7SUFFdkIsUUFBUTtXQUFSLFFBQVE7MEJBQVIsUUFBUTs7O2VBQVIsUUFBUTs7V0FHTixrQkFBRztBQUNQLFVBQUksQ0FBQyxPQUFPLEdBQUcseUJBQVk7QUFDekIsVUFBRSxFQUFFLE9BQU87QUFDWCxnQkFBUSxtQkFBTTtPQUNmLENBQUMsQ0FBQztLQUNKOzs7V0FFVSx1QkFBRztBQUNaLGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztXQUVPLG9CQUFHO0FBQ1QsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ2hDOzs7U0FoQkcsUUFBUTs7O3FCQW9CQyxRQUFROzs7O0FDdkJ2Qjs7Ozs7O3VCQ0FxQixTQUFTOzs7O3VCQUNULFNBQVM7Ozs7cUJBQ1QsT0FBTzs7Ozt5QkFDUCxXQUFXOzs7OzhCQUNYLGtCQUFrQjs7Ozs7O2lDQUdoQix1QkFBdUI7Ozs7aUNBQ3ZCLHVCQUF1Qjs7OzsrQkFDdkIs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QU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDM0I7OztXQUVPLG1CQUFHO0FBQ1QsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzVCOzs7U0FiRyxXQUFXOzs7cUJBaUJGLFdBQVc7Ozs7Ozs7OztxQkNwQlg7QUFDYixLQUFHLEVBQUUsMkJBQTJCO0NBQ2pDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBSYWN0aXZlIGZyb20gJ3JhY3RpdmUnO1xyXG5pbXBvcnQgaHRtbCBmcm9tICcuLzQwNC5yYWN0JztcclxuXHJcbmNsYXNzIE5vdEZvdW5kIHtcclxuXHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHRoaXMucmFjdGl2ZSA9IG5ldyBSYWN0aXZlKHtcclxuICAgICAgZWw6ICcjdmlldycsXHJcbiAgICAgIHRlbXBsYXRlOiBodG1sXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlzUHJvdGVjdGVkKCkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgdW5yZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yYWN0aXZlLnRlYXJkb3duKCk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTm90Rm91bmRcclxuIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRhaW5lclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwicm93XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2wteHMtMTJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDFcIixcImZcIjpbXCI0MDQgcGFnZSBub3QgZm91bmRcIl19XX1dfV19XX0iLCJpbXBvcnQgUmFjdGl2ZSAgZnJvbSAncmFjdGl2ZSc7XHJcbmltcG9ydCBMb2dkb3duICBmcm9tICdsb2dkb3duJztcclxuaW1wb3J0IGF4aW9zICAgIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IFBhcnNsZXkgIGZyb20gJ3BhcnNsZXlqcyc7XHJcbmltcG9ydCBpbyAgICAgICBmcm9tICdzb2NrZXQuaW8tY2xpZW50J1xyXG5cclxuLy8gUyBzdWZmaXggZm9yIFNFUlZJQ0VTXHJcbmltcG9ydCBSb3V0ZXIgICAgIGZyb20gJy4vc2VydmljZXMvcm91dGVyLmVzNic7XHJcbmltcG9ydCBldmVudHMgICAgIGZyb20gJy4vc2VydmljZXMvZXZlbnRzLmVzNic7XHJcbmltcG9ydCBBdXRoICAgICAgIGZyb20gJy4vc2VydmljZXMvYXV0aC5lczYnO1xyXG5pbXBvcnQgc3RvcmFnZSAgICBmcm9tICcuL3NlcnZpY2VzL3N0b3JhZ2UuZXM2JztcclxuaW1wb3J0IFBsYXlsaXN0UyAgZnJvbSAnLi9zZXJ2aWNlcy9wbGF5bGlzdFNlcnZpY2UuZXM2JztcclxuaW1wb3J0IFVzZXJTICAgICAgZnJvbSAnLi9zZXJ2aWNlcy91c2VyU2VydmljZS5lczYnO1xyXG5cclxuaW1wb3J0IHBhcnNsZXlEZWNvcmF0b3IgIGZyb20gJy4vc2VydmljZXMvcGFyc2xleS1kZWNvcmF0b3IuZXM2JzsgXHJcblJhY3RpdmUuZGVjb3JhdG9ycy5wYXJzbGV5ID0gcGFyc2xleURlY29yYXRvcjtcclxuXHJcblxyXG4vLyBNb2RlbHNcclxuaW1wb3J0IFBsYXlsaXN0TSBmcm9tICcuL21vZGVscy9wbGF5bGlzdC5lczYnO1xyXG5pbXBvcnQgVXNlck0gICAgIGZyb20gJy4vbW9kZWxzL3VzZXIuZXM2JztcclxuXHJcbi8vIEMgc3VmZml4IGZvciBDT05UUk9MTEVSUyBcclxuaW1wb3J0IEhvbWVDICAgICAgICBmcm9tICcuL2hvbWUvaG9tZS5lczYnO1xyXG5pbXBvcnQgUGxheWxpc3RDICAgIGZyb20gJy4vcGxheWxpc3QvcGxheWxpc3QuZXM2JztcclxuaW1wb3J0IExvZ2luQyAgICAgICBmcm9tICcuL2xvZ2luL2xvZ2luLmVzNic7XHJcbmltcG9ydCBOb3RGb3VuZEMgICAgZnJvbSAnLi80MDQvNDA0LmVzNic7XHJcblxyXG5pbXBvcnQgY29uZmlnICAgZnJvbSAnY29uZmlndXJhdGlvbic7XHJcblxyXG5sZXQgbG9nZ2VyICA9IG5ldyBMb2dkb3duKHtwcmVmaXg6ICdhcHAnfSk7XHJcbmxldCBhdXRoICAgID0gbmV3IEF1dGgoYXhpb3MsIHN0b3JhZ2UsIGV2ZW50cywgY29uZmlnKTtcclxubGV0IHJvdXRlciAgPSBuZXcgUm91dGVyKGF1dGgsIGV2ZW50cyk7XHJcblxyXG5sZXQgcGxTZXJ2aWNlID0gbmV3IFBsYXlsaXN0UyhQbGF5bGlzdE0pO1xyXG5sZXQgdVNlcnZpY2UgID0gbmV3IFVzZXJTKFVzZXJNKTtcclxuXHJcbi8vIEludGVyY2VwdG9ycyBhbGxvdyB1cyB0byBjaGFuZ2UgaGVhZGVycyBiZWZvcmUgcmVxdWVzdCBpcyBzZW50LlxyXG5heGlvcy5pbnRlcmNlcHRvcnMucmVxdWVzdC51c2UoZnVuY3Rpb24oY29uZmlnKSB7XHJcbiAgbGV0IGFjY2Vzc1Rva2VuID0gc3RvcmFnZS5sb2NhbC5nZXQoJ2FjY2Vzc1Rva2VuJyk7XHJcbiAgaWYoYWNjZXNzVG9rZW4pIGNvbmZpZy5oZWFkZXJzWydYLUF1dGgtVG9rZW4nXSA9IGFjY2Vzc1Rva2VuO1xyXG4gIGVsc2UgZGVsZXRlIGNvbmZpZy5oZWFkZXJzWydYLUF1dGgtVG9rZW4nXTtcclxuICByZXR1cm4gY29uZmlnO1xyXG59KTtcclxuXHJcbmxldCBzb2NrZXQgPSBpby5jb25uZWN0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAnKTtcclxuXHJcbnJvdXRlci5hZGRSb3V0ZSgnbG9naW4nLCBuZXcgTG9naW5DKGF1dGgsIGV2ZW50cywgc29ja2V0KSk7XHJcbnJvdXRlci5hZGRSb3V0ZSgnaG9tZScsIG5ldyBIb21lQyhhdXRoLCBldmVudHMsIHBsU2VydmljZSwgc29ja2V0KSk7XHJcbnJvdXRlci5hZGRSb3V0ZSgncGxheWxpc3Qve2lkfScsIG5ldyBQbGF5bGlzdEMoYXV0aCwgZXZlbnRzLCBwbFNlcnZpY2UsIHVTZXJ2aWNlLCBzb2NrZXQpKTtcclxucm91dGVyLmFkZFJvdXRlKCc0MDQnLCBuZXcgTm90Rm91bmRDKCkpO1xyXG5cclxuLy8gRmlyc3QgdGhpbmcgb24gcGFnZSBsb2FkIChiZWZvcmUgdHJ5aW5nIHRvIHJvdXRlIHRvIHRoZSBjdXJyZW50IGhhc2gpIGlzIHRvIGVzdGFibGlzaCBpZiB0aGUgdXNlclxyXG4vLyBpcyBsb2dnZWQgaW4sIGFuZCBpZiBub3QsIHdoZXRoZXIgdGhleSBzaG91bGQgYmUgZGlyZWN0ZWQgc29tZXdoZXJlIGVsc2UgZmlyc3QuXHJcbmF1dGgucmVzdG9yZUxvZ2luKCkudGhlbihmdW5jdGlvbigpIHtcclxuXHJcbiAgLy8gQWZ0ZXIgbG9naW4gaGFzIGJlZW4gcmVzdG9yZWQgd2UgY2FuIGluaXRpYWxpc2Ugcm91dGluZy4gVGhpcyB3aWxsIGNhdXNlIHRoZSByb3V0ZXJcclxuICAvLyB0byBsb2FkIHRoZSBwYWdlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGN1cnJlbnQgcm91dGUuXHJcbiAgLy8gSW5pdGlhbGlzbmcgdGhlIHJvdXRlciBhZnRlciBhdXRoZW50aWNhdGlvbiBtZWFuczpcclxuICAvLyBhKSB3ZSBjYW4gY2xlYW5seSBjaGVjayB0aGF0IHRoZSB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQgZm9yIHRoZSBwYWdlXHJcbiAgLy8gYikgdGhlIHJlc3RvcmVkIGxvZ2luIGhhbmRsZXIgY2FuIHRyYW5zaXRpb24gdG8gYW55IGFwcHJvcHJpYXRlIHBhZ2VzIEJFRk9SRSB0aGUgcm91dGVyXHJcbiAgLy8gICAgaW5pdGlhbGlzZXMgYW5kIHN0YXJ0cyB0byBhdXRvIGxvYWQgd2hhdGV2ZXIgbG9jYXRpb24gdGhlIGFwcCBtaWdodCBiZSBhdC5cclxuICByb3V0ZXIuaW5pdGlhbGlzZSgpO1xyXG59KTtcclxuXHJcbi8vIEV2ZW50IGlzIGZpcmVkIGFmdGVyIGF1dGggc2VydmljZSBoYXMgYXR0ZW1wdGVkIHRvIGxvZyBpbi5cclxuZXZlbnRzLmF1dGgucmVzdG9yZWRMb2dpbi5hZGQoZnVuY3Rpb24oZXJyLCB1c2VyKSB7XHJcblxyXG4gIGlmKGVyciAmJiBlcnIuc3RhdHVzID09PSA0MDEpIHtcclxuICAgIGxvZ2dlci53YXJuKCdBIGZhaWxlZCBsb2cgaW4gYXR0ZW1wdCBoYXMgYmVlbiBtYWRlJyk7XHJcbiAgICByZXR1cm4gcm91dGVyLnRyYW5zaXRpb25UbygnbG9naW4nKTtcclxuICB9XHJcblxyXG4gIGlmKGVycikge1xyXG4gICAgbG9nZ2VyLndhcm4oJ2Nvbm5lY3Rpb24gdG8gdGhlIGFwaSBoYXMgYmVlbiBsb3N0Jyk7XHJcbiAgICByZXR1cm4gcm91dGVyLnRyYW5zaXRpb25Ubygnc29ycnknKTtcclxuICB9XHJcblxyXG4gIC8vIElmIG5vIGVycm9yICh0aGUgdXNlciBpcyBsb2dnZWQpIHRoZW4gdGhlIHJvdXRlciB3aWxsIGF1dG9tYXRpY2FsbHkgbG9hZCB0aGUgcGFnZVxyXG4gIC8vIGFzc29jaWF0ZWQgd2l0aCB0aGUgY3VycmVudCBoYXNoL2ZyYWdtZW50IHdoZW4gaXQgaW5pdGlhbGlzZXMuXHJcbiAgbG9nZ2VyLmxvZygndGhlIGxvZ2luIGNyZWRlbnRpYWxzIGhhdmUgYmVlbiByZXN0b3JlZCcpO1xyXG59KTtcclxuXHJcbmV2ZW50cy5yb3V0aW5nLmFjY2Vzc0RlbmllZC5hZGQoZnVuY3Rpb24ocGF0aCkge1xyXG4gIFxyXG4gIGxvZ2dlci53YXJuKCdhY2Nlc3MgdG8gJyArIHBhdGggKyAnIGhhcyBiZWVuIGRlbmllZCcpO1xyXG4gIHJldHVybiByb3V0ZXIudHJhbnNpdGlvblRvKCdsb2dpbicpO1xyXG59KTtcclxuXHJcbmV2ZW50cy5yb3V0aW5nLm5vdEZvdW5kLmFkZChmdW5jdGlvbigpIHtcclxuICBsb2dnZXIubG9nKCd0aGUgZW50ZXJlZCBwYXRoIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xyXG4gIHJldHVybiByb3V0ZXIudHJhbnNpdGlvblRvKCc0MDQnKTtcclxufSk7XHJcblxyXG5ldmVudHMucm91dGluZy50cmFuc2l0aW9uVG8uYWRkKGZ1bmN0aW9uKHBhdGgsIHZpZXcpIHtcclxuICBsb2dnZXIubG9nKCd0cmFuc2l0aW9uaW5nIHRvICcgKyBwYXRoKTtcclxuICB2aWV3LnVucmVuZGVyKCkudGhlbihmdW5jdGlvbigpe1xyXG4gICAgcm91dGVyLnRyYW5zaXRpb25UbyhwYXRoKTtcclxuICB9KTtcclxufSk7XHJcbiIsImltcG9ydCBSYWN0aXZlIGZyb20gJ3JhY3RpdmUnO1xyXG5pbXBvcnQgaHRtbCBmcm9tICcuL2hvbWUucmFjdCc7XHJcbmltcG9ydCBuYXZiYXIgZnJvbSAnLi4vbmF2YmFyL25hdmJhci5yYWN0JztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xyXG5cclxuY2xhc3MgSG9tZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGF1dGgsIGV2ZW50cywgcGxheWxpc3RTZXJ2aWNlLCBzb2NrZXQpe1xyXG4gICAgdGhpcy5hdXRoICAgPSBhdXRoO1xyXG4gICAgdGhpcy5ldmVudHMgPSBldmVudHM7XHJcbiAgICB0aGlzLnBsYXlsaXN0cyA9IFtdO1xyXG4gICAgdGhpcy5wbGF5bGlzdFNlcnZpY2UgPSBwbGF5bGlzdFNlcnZpY2U7XHJcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcclxuICB9XHJcblxyXG4gIHJlbmRlcihoYXNoKSB7XHJcblxyXG4gICAgdGhpcy5sb2dnZWRJblVzZXIgPSB0aGlzLmF1dGgubG9nZ2VkSW5Vc2VyKCk7IFxyXG4gICAgdGhpcy5yYWN0aXZlID0gbmV3IFJhY3RpdmUoe1xyXG4gICAgICBlbDogJyN2aWV3JyxcclxuICAgICAgdGVtcGxhdGU6IGh0bWwsXHJcbiAgICAgIHBhcnRpYWxzOiB7bmF2YmFyOiBuYXZiYXJ9LFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgdXNlcjogdGhpcy5sb2dnZWRJblVzZXJcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5yYWN0aXZlLm9uKCdhZGRQbGF5bGlzdCcsIChlLCBuYW1lKSA9PiB7XHJcbiAgICAgIHRoaXMucGxheWxpc3RTZXJ2aWNlLmFkZCh7bmFtZX0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5yYWN0aXZlLm9uKCdkZWxQbGF5bGlzdCcsIChlLCBwbGF5bGlzdCkgPT4ge1xyXG4gICAgICB0aGlzLnBsYXlsaXN0U2VydmljZS5yZW1vdmUocGxheWxpc3QpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5yYWN0aXZlLm9uKCdsb2dvdXQnLCAoKSA9PiB0aGlzLmxvZ291dCgpKTsgXHJcblxyXG4gICAgdGhpcy5zb2NrZXQub24oJ3NhdmVkLXBsYXlsaXN0JywgKHBsKSA9PiB0aGlzLmNoYW5nZWRQbGF5bGlzdChwbCkpO1xyXG4gICAgdGhpcy5zb2NrZXQub24oJ2RlbC1wbGF5bGlzdCcsIChwbCkgPT4gdGhpcy5kZWxldGVQbGF5bGlzdChwbCkpO1xyXG5cclxuICAgIHRoaXMucGxheWxpc3RTZXJ2aWNlLmZpbmRBbGwodGhpcy5sb2dnZWRJblVzZXIuX2lkKS50aGVuKChwbGF5bGlzdHMpID0+IHtcclxuICAgICAgdGhpcy5wbGF5bGlzdHMgPSBwbGF5bGlzdHM7XHJcbiAgICAgIHRoaXMucmFjdGl2ZS5zZXQoJ3BsYXlsaXN0cycsIHRoaXMucGxheWxpc3RzKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGNoYW5nZWRQbGF5bGlzdChwbCkge1xyXG4gICAgdGhpcy5wbGF5bGlzdFNlcnZpY2UuZmluZChwbC5faWQsIHRoaXMubG9nZ2VkSW5Vc2VyLl9pZCkudGhlbigoZnVsbFBsKSA9PiB7IFxyXG4gICAgICBsZXQgdGhpc1BsID0gXy5maW5kKHRoaXMucGxheWxpc3RzLCB7X2lkOiBwbC5faWR9KVxyXG4gICAgICBcclxuICAgICAgLy8gSWYgdGhlIHBsYXlsaXN0IGFscmVhZHkgZXhpc3RzIGl0IG11c3QgYmUgcmVtb3ZlZC4gKG90aGVyd2lzZSBpdCBpcyBuZXcpXHJcbiAgICAgIGlmKHRoaXNQbCkge1xyXG4gICAgICAgIHRoaXMucGxheWxpc3RzLnNwbGljZShfLmluZGV4T2YodGhpc1BsKSwgMSlcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnBsYXlsaXN0cy5wdXNoKGZ1bGxQbClcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBkZWxldGVQbGF5bGlzdChwbCkge1xyXG4gICAgbGV0IGluZGV4ID0gXy5pbmRleE9mKF8uZmluZCh0aGlzLnBsYXlsaXN0cywge19pZDogcGwuX2lkfSkpXHJcbiAgICB0aGlzLnBsYXlsaXN0cy5zcGxpY2UoaW5kZXgsMSk7XHJcbiAgfVxyXG5cclxuICBsb2dvdXQoKSB7XHJcbiAgICB0aGlzLmF1dGguY2xlYXJMb2dpbigpO1xyXG4gICAgdGhpcy5ldmVudHMucm91dGluZy50cmFuc2l0aW9uVG8uZGlzcGF0Y2goJ2xvZ2luJywgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBpc1Byb3RlY3RlZCgpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgdW5yZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yYWN0aXZlLnRlYXJkb3duKClcclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIb21lO1xyXG4iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjgsXCJyXCI6XCJuYXZiYXJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGFpbmVyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJyb3dcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbC14cy0xMlwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoM1wiLFwiZlwiOltcIllvdXIgcGxheWxpc3RzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRhYmxlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRoZWFkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0aFwiLFwiZlwiOltcIk5hbWVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGhcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGJvZHlcIixcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOltcIiMvcGxheWxpc3QvXCIse1widFwiOjIsXCJyXCI6XCJfaWRcIn1dfSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJuYW1lXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImFyaWEtaGlkZGVuXCI6XCJ0cnVlXCIsXCJjbGFzc1wiOlwiZ2x5cGhpY29uIGdseXBoaWNvbi10cmFzaCBwdWxsLXJpZ2h0XCJ9LFwidlwiOntcImNsaWNrXCI6e1wiblwiOlwiZGVsUGxheWxpc3RcIixcImRcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX19fV19XX1dLFwiblwiOjUwLFwiclwiOlwiaXNPd25lclwifV0sXCJuXCI6NTIsXCJyXCI6XCJwbGF5bGlzdHNcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJ0ZXh0XCIsXCJwbGFjZWhvbGRlclwiOlwibmV3IGxpc3RcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwibmV3TGlzdE5hbWVcIn1dLFwiY2xhc3NcIjpcImZvcm0tY29udHJvbFwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwic3VibWl0XCIsXCJjbGFzc1wiOlwiYnRuIGJ0bi1ibG9jayBidG4tc3VjY2VzcyBjZW50ZXItYmxvY2tcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJuXCI6XCJhZGRQbGF5bGlzdFwiLFwiZFwiOlt7XCJ0XCI6MixcInJcIjpcIm5ld0xpc3ROYW1lXCJ9XX19LFwiZlwiOltcIkFkZFwiXX1dfV19XX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwicm93XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2wteHMtMTJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDNcIixcImZcIjpbXCJQbGF5bGlzdHMgYnkgb3RoZXJzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRhYmxlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRoZWFkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0aFwiLFwiZlwiOltcIk5hbWVcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRib2R5XCIsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpbXCIjL3BsYXlsaXN0L1wiLHtcInRcIjoyLFwiclwiOlwiX2lkXCJ9XX0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibmFtZVwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiYXJpYS1oaWRkZW5cIjpcInRydWVcIixcImNsYXNzXCI6XCJnbHlwaGljb24gZ2x5cGhpY29uLXN0YXItZW1wdHkgcHVsbC1yaWdodFwifX1dLFwiblwiOjUwLFwiclwiOlwiaXNFZGl0b3JcIn1dfV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJpc093bmVyXCJdLFwic1wiOlwiIV8wXCJ9fV0sXCJuXCI6NTIsXCJyXCI6XCJwbGF5bGlzdHNcIn1dfV19XX1dfV19XX0iLCJpbXBvcnQgUmFjdGl2ZSBmcm9tICdyYWN0aXZlJ1xyXG5pbXBvcnQgaHRtbCBmcm9tICcuL2xvZ2luLnJhY3QnXHJcblxyXG5jbGFzcyBMb2dpbiB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGF1dGgsIGV2ZW50cywgc29ja2V0KSB7XHJcbiAgICB0aGlzLmF1dGggPSBhdXRoO1xyXG4gICAgdGhpcy5ldmVudHMgPSBldmVudHM7XHJcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuXHJcbiAgICB0aGlzLnJhY3RpdmUgPSBuZXcgUmFjdGl2ZSh7XHJcbiAgICAgIGVsOiAnI3ZpZXcnLFxyXG4gICAgICB0ZW1wbGF0ZTogaHRtbCxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIHNob3dFcnJvcjogZmFsc2VcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5yYWN0aXZlLm9uKCdzaWduSW4nLCAoKSA9PiB7XHJcbiAgICAgIGxldCB1c2VybmFtZSA9IHRoaXMucmFjdGl2ZS5nZXQoJ3VzZXJuYW1lJyk7XHJcbiAgICAgIGxldCBwYXNzd29yZCA9IHRoaXMucmFjdGl2ZS5nZXQoJ3Bhc3N3b3JkJyk7XHJcbiAgICAgIHRoaXMuc2lnbkluKHVzZXJuYW1lLCBwYXNzd29yZCk7XHJcbiAgICB9KTtcclxuICAgICAgICBcclxuICB9XHJcblxyXG4gIHNpZ25Jbih1c2VybmFtZSwgcGFzc3dvcmQpIHtcclxuICAgIHRoaXMuYXV0aC5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpXHJcbiAgICAgIC50aGVuKCh1c2VyKSA9PiB0aGlzLmdvVG9Ib21lU2NyZWVuKCksXHJcbiAgICAgICAgICAgIChlcnIpID0+IHRoaXMuc2hvd0Vycm9yKGVycikpXHJcbiAgfVxyXG5cclxuICBzaG93RXJyb3IoZXJyKSB7XHJcbiAgICB0aGlzLnJhY3RpdmUuc2V0KCdzaG93RXJyb3InLCB0cnVlKTtcclxuICB9XHJcblxyXG4gIGdvVG9Ib21lU2NyZWVuKCkge1xyXG4gICAgdGhpcy5ldmVudHMucm91dGluZy50cmFuc2l0aW9uVG8uZGlzcGF0Y2goJ2hvbWUnLCB0aGlzKTtcclxuICB9IFxyXG5cclxuICBpc1Byb3RlY3RlZCgpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHVucmVuZGVyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmFjdGl2ZS50ZWFyZG93bigpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExvZ2luXHJcbiIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250YWluZXJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInJvd1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJzdHlsZVwiOlwicGFkZGluZzogNTBweCAwO1wiLFwiY2xhc3NcIjpcImNvbC14cy02IGNvbC14cy1vZmZzZXQtM1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMVwiLFwiYVwiOntcInN0eWxlXCI6XCJ0ZXh0LWFsaWduOmNlbnRlcjtcIn0sXCJmXCI6W1wiV2VsY29tZSBUbyBQbGF5bGlzdFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJoNFwiLFwiYVwiOntcInN0eWxlXCI6XCJ0ZXh0LWFsaWduOmNlbnRlcjtcIn0sXCJmXCI6W1wiQ09MTEFCT1JBVElWRSAtIFBMQVlMSVNUUyAtIE9OTElORVwiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInJvd1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sLXhzLTYgY29sLXhzLW9mZnNldC0zXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImZvcm1cIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZm9ybS1ncm91cFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlcm5hbWVcIn1dLFwidHlwZVwiOlwidXNlcm5hbWVcIixcImlkXCI6XCJleGFtcGxlSW5wdXRFbWFpbDFcIixcInBsYWNlaG9sZGVyXCI6XCJVc2VybmFtZVwiLFwiY2xhc3NcIjpcImZvcm0tY29udHJvbFwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmb3JtLWdyb3VwXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwYXNzd29yZFwifV0sXCJ0eXBlXCI6XCJwYXNzd29yZFwiLFwiaWRcIjpcImV4YW1wbGVJbnB1dFBhc3N3b3JkMVwiLFwicGxhY2Vob2xkZXJcIjpcIlBhc3N3b3JkXCIsXCJjbGFzc1wiOlwiZm9ybS1jb250cm9sXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwic3VibWl0XCIsXCJkaXNhYmxlZFwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W10sXCJzXCI6XCJmYWxzZVwifX1dLFwiY2xhc3NcIjpcImJ0biBidG4tZGVmYXVsdFwifSxcInZcIjp7XCJjbGlja1wiOlwic2lnbkluXCJ9LFwiZlwiOltcIlN1Ym1pdFwiXX1dfV19XX1dfV19IiwiaW1wb3J0IGF4aW9zICBmcm9tICdheGlvcydcclxuaW1wb3J0IF8gICAgICBmcm9tICdsb2Rhc2gnXHJcbmltcG9ydCBjb25maWcgZnJvbSAnY29uZmlndXJhdGlvbidcclxuXHJcbmNsYXNzIFBsYXlsaXN0IHtcclxuXHJcbiAgY29uc3RydWN0b3IocGxheWxpc3QpIHtcclxuICAgIF8uZXh0ZW5kICh0aGlzLCBwbGF5bGlzdCk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFwUGxheWxpc3QgKHJlc3BvbnNlKSB7XHJcbiAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuZGF0YSkge1xyXG4gICAgICByZXR1cm4gbmV3IFBsYXlsaXN0KHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHt9O1xyXG4gIH1cclxuXHJcblxyXG5cclxuICAvLyBNYXBzIHRoZSByZXNwb25zZSBkYXRhIGZyb20gdGhlIGFwaSB0byB0aGlzIGF1Z21lbnRlZCBcclxuICAvLyBmcm9udCBlbmQgZG9tYWluIG1vZGVsLlxyXG4gIHN0YXRpYyBtYXBQbGF5bGlzdHMgKHJlc3BvbnNlKSB7XHJcbiAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuZGF0YSkge1xyXG4gICAgICByZXR1cm4gXy5tYXAgKHJlc3BvbnNlLmRhdGEsIChwbGF5bGlzdCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUGxheWxpc3QgKHBsYXlsaXN0KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIHN0YXRpYyBmaW5kKGlkKSB7XHJcbiAgICAgIHJldHVybiBheGlvcy5nZXQoY29uZmlnLmFwaSArICcvcGxheWxpc3RzLycgKyBpZClcclxuICAgICAgICAudGhlbihQbGF5bGlzdC5tYXBQbGF5bGlzdCk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIC8vIFJldHJlaXZlIGFsbCBwbGF5bGlzdHMgZnJvbSB0aGUgQVBJIGFuZCBtYXAgdG8gZGFtYWluIG1vZGVsLlxyXG4gIHN0YXRpYyBmaW5kQWxsKCkge1xyXG4gICAgcmV0dXJuIGF4aW9zLmdldChjb25maWcuYXBpICsgJy9wbGF5bGlzdHMnKVxyXG4gICAgICAudGhlbihQbGF5bGlzdC5tYXBQbGF5bGlzdHMpO1xyXG4gIH1cclxuXHJcbiAgc2F2ZSgpIHtcclxuICAgIGlmKCF0aGlzLm5hbWUpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRnV0dXJlIGZpeCB3b3VsZCBiZSB0byBhdHRhY2ggdXBkYXRlIGxpbmtzIHRvIHJlc291cmNlcyBpbiBiYWNrZW5kIGZvciBtb3JlXHJcbiAgICAvLyBSRVNUZnVsIGJlaGF2aW91ci5cclxuICAgIGlmKHRoaXMuX2lkKSB7XHJcbiAgICAgIHJldHVybiBheGlvcy5wdXQodGhpcy5fbGlua3Muc2VsZi5ocmVmLCB0aGlzKVxyXG4gICAgICAgIC50aGVuKFBsYXlsaXN0Lm1hcFBsYXlsaXN0LCAoZXJyKSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXhpb3MucG9zdChjb25maWcuYXBpICsgJy9wbGF5bGlzdHMnLCB0aGlzKVxyXG4gICAgICAudGhlbihQbGF5bGlzdC5tYXBQbGF5bGlzdCwgKGVycikgPT4gY29uc29sZS5sb2coZXJyKSk7XHJcbiAgfVxyXG5cclxuICBkZWwoKSB7XHJcbiAgICByZXR1cm4gYXhpb3MuZGVsZXRlKHRoaXMuX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQbGF5bGlzdDtcclxuIiwiaW1wb3J0IGF4aW9zICBmcm9tICdheGlvcydcclxuaW1wb3J0IF8gICAgICBmcm9tICdsb2Rhc2gnXHJcbmltcG9ydCBjb25maWcgZnJvbSAnY29uZmlndXJhdGlvbidcclxuXHJcbmNsYXNzIFVzZXIge1xyXG5cclxuICBjb25zdHJ1Y3Rvcih1c2VyKSB7XHJcbiAgICBfLmV4dGVuZCAodGhpcywgdXNlcik7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFwVXNlciAocmVzcG9uc2UpIHtcclxuICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5kYXRhKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVXNlcihyZXNwb25zZS5kYXRhKTtcclxuICAgIH1cclxuICAgIHJldHVybiB7fTtcclxuICB9XHJcblxyXG4gIC8vIE1hcHMgdGhlIHJlc3BvbnNlIGRhdGEgZnJvbSB0aGUgYXBpIHRvIHRoaXMgYXVnbWVudGVkIFxyXG4gIC8vIGZyb250IGVuZCBkb21haW4gbW9kZWwuXHJcbiAgc3RhdGljIG1hcFVzZXJzIChyZXNwb25zZSkge1xyXG4gICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLmRhdGEpIHtcclxuICAgICAgcmV0dXJuIF8ubWFwIChyZXNwb25zZS5kYXRhLCAodXNlcikgPT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgVXNlciAodXNlcik7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcblxyXG4gIHN0YXRpYyBmaW5kKGlkKSB7XHJcbiAgICAgIHJldHVybiBheGlvcy5nZXQoY29uZmlnLmFwaSArICcvdXNlcnMvJyArIGlkKVxyXG4gICAgICAgIC50aGVuKFVzZXIubWFwVXNlcik7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gUmV0cmVpdmUgYWxsIHBsYXlsaXN0cyBmcm9tIHRoZSBBUEkgYW5kIG1hcCB0byBkYW1haW4gbW9kZWwuXHJcbiAgc3RhdGljIGZpbmRBbGwoKSB7XHJcbiAgICByZXR1cm4gYXhpb3MuZ2V0KGNvbmZpZy5hcGkgKyAnL3VzZXJzJylcclxuICAgICAgLnRoZW4oVXNlci5tYXBVc2Vycyk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVXNlcjtcclxuIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwibmF2XCIsXCJhXCI6e1wicm9sZVwiOlwibmF2aWdhdGlvblwiLFwiY2xhc3NcIjpcIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItc3RhdGljLXRvcFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGFpbmVyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJuYXZiYXItaGVhZGVyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcImJ1dHRvblwiLFwiZGF0YS10b2dnbGVcIjpcImNvbGxhcHNlXCIsXCJkYXRhLXRhcmdldFwiOlwiI2NvbGxhcHNlLTFcIixcImFyaWEtZXhwYW5kZWRcIjpcImZhbHNlXCIsXCJjbGFzc1wiOlwibmF2YmFyLXRvZ2dsZSBjb2xsYXBzZWRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJzci1vbmx5XCJ9LFwiZlwiOltcIlRvZ2dsZSBuYXZpZ2F0aW9uXCJdfSx7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiaWNvbi1iYXJcIn19LHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJpY29uLWJhclwifX0se1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImljb24tYmFyXCJ9fV19LHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIiMvaG9tZVwiLFwiY2xhc3NcIjpcIm5hdmJhci1icmFuZFwifSxcImZcIjpbXCJQbGF5TGlzdFwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImlkXCI6XCJjb2xsYXBzZS0xXCIsXCJjbGFzc1wiOlwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwidlwiOntcImNsaWNrXCI6XCJsb2dvdXRcIn0sXCJhXCI6e1wiY2xhc3NcIjpcImJ0biBuYXZiYXItYnRuIGJ0bi1kYW5nZXIgcHVsbC1yaWdodFwifSxcImZcIjpbXCJMb2dvdXRcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiYVwiOntcImNsYXNzXCI6XCJuYXZiYXItdGV4dCBwdWxsLXJpZ2h0XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIudXNlcm5hbWVcIn1dfV19XX1dfV19IiwiaW1wb3J0IFJhY3RpdmUgIGZyb20gJ3JhY3RpdmUnO1xyXG5pbXBvcnQgaHRtbCAgICAgZnJvbSAnLi9wbGF5bGlzdC5yYWN0JztcclxuaW1wb3J0IG5hdmJhciAgIGZyb20gJy4uL25hdmJhci9uYXZiYXIucmFjdCc7XHJcbmltcG9ydCBheGlvcyAgICBmcm9tICdheGlvcyc7XHJcbmltcG9ydCBfICAgICAgICBmcm9tICdsb2Rhc2gnXHJcblxyXG5jbGFzcyBQbGF5bGlzdCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGF1dGgsIGV2ZW50cywgcGxheWxpc3RTZXJ2aWNlLCB1c2VyU2VydmljZSwgc29ja2V0KSB7XHJcbiAgICB0aGlzLmF4aW9zICAgID0gYXhpb3M7XHJcbiAgICB0aGlzLmF1dGggICAgID0gYXV0aDtcclxuICAgIHRoaXMuZXZlbnRzICAgPSBldmVudHM7XHJcbiAgICB0aGlzLnNvY2tldCAgID0gc29ja2V0O1xyXG4gICAgdGhpcy5wbGF5bGlzdFNlcnZpY2UgPSBwbGF5bGlzdFNlcnZpY2U7XHJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlICA9IHVzZXJTZXJ2aWNlO1xyXG4gICAgdGhpcy5wbGF5ZXIgICA9IHt9O1xyXG4gICAgdGhpcy5wbGF5bGlzdCA9IHt9O1xyXG4gICAgdGhpcy5jdXJyZW50VmlkID0gMFxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKGhhc2gpIHtcclxuXHJcbiAgICBsZXQgcGF0aHMgPSBoYXNoLnNwbGl0KCcvJyk7XHJcbiAgICB0aGlzLmlkID0gcGF0aHNbcGF0aHMubGVuZ3RoIC0gMV07XHJcbiAgICB0aGlzLmxvZ2dlZEluVXNlciA9IHRoaXMuYXV0aC5sb2dnZWRJblVzZXIoKTtcclxuXHJcbiAgICB0aGlzLnJhY3RpdmUgPSBuZXcgUmFjdGl2ZSh7XHJcbiAgICAgIGVsOiAnI3ZpZXcnLFxyXG4gICAgICB0ZW1wbGF0ZTogaHRtbCxcclxuICAgICAgcGFydGlhbHM6IHtuYXZiYXI6IG5hdmJhcn0sXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBzZWFyY2hUZXJtOiAnJyxcclxuICAgICAgICB1c2VyOiB0aGlzLmF1dGgubG9nZ2VkSW5Vc2VyKCksXHJcbiAgICAgICAgdXNlcnM6IFtdXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAvLyBGaWx0ZXIgb3V0IHVzZXJzIHRvIGFkZCBhcyBjb2xsYWJvcmF0b3JzIGJhc2VkIG9uIHRoZSBzZWFyY2ggdGVybVxyXG4gICAgdGhpcy5yYWN0aXZlLm9ic2VydmUoICdzZWFyY2hUZXJtJywgKCBuZXdWYWx1ZSwgb2xkVmFsdWUgKSA9PiB7XHJcbiAgICAgIFxyXG4gICAgICBpZihuZXdWYWx1ZS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJhY3RpdmUuc2V0KCdhZGRFZGl0b3JMaXN0JywgW10pXHJcbiAgICAgIH0gXHJcbiAgICAgIFxyXG4gICAgICBsZXQgZmlsdGVyZWQgPSB0aGlzLnVzZXJzLmZpbHRlcigodXNlcikgPT4geyBcclxuXHJcbiAgICAgICAgLy8gQ2FuJ3QgYWRkIHNvbWVvbmUgd2hvIGlzIGFscmVhZHkgYW4gZWRpdG9yLlxyXG4gICAgICAgIGxldCBhbHJlYWR5RWRpdG9yID0gdGhpcy5wbGF5bGlzdC5lZGl0b3JzLnNvbWUoKGVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHVzZXIuX2lkID09IGVkaXRvci5faWRcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBDYW4ndCBhZGQgeW91cnNlbGYgb3Igc29tZW9uZSB3aG8gaXMgYWxyZWFkeSBhbiBlZGl0b3JcclxuICAgICAgICBpZihhbHJlYWR5RWRpdG9yIHx8IHVzZXIuX2lkID09IHRoaXMubG9nZ2VkSW5Vc2VyLl9pZCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAvLyBVc2VyIG5hbWUgbXVzdCBtYXRjaCBzZWFyY2ggcXVlcnlcclxuICAgICAgICByZXR1cm4gXy5jb250YWlucyh1c2VyLnVzZXJuYW1lLCBuZXdWYWx1ZSlcclxuXHJcbiAgICAgIH0pXHJcbiAgXHJcbiAgICAgIHRoaXMucmFjdGl2ZS5zZXQoJ2FkZEVkaXRvckxpc3QnLCBmaWx0ZXJlZClcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEdldCB1c2VyIGxpc3QgYW5kIHNhdmUgbG9jYWxseS5cclxuICAgIHRoaXMudXNlclNlcnZpY2UuZmluZEFsbCgpLnRoZW4oKHVzZXJzKSA9PiB7XHJcbiAgICAgIHRoaXMudXNlcnMgPSB1c2VycztcclxuICAgICAgdGhpcy5yYWN0aXZlLnNldCgndXNlcnMnLCB0aGlzLnVzZXJzKTtcclxuICAgIH0pXHJcbiAgIFxyXG4gICAgLy8gVG8gQWRkIGFuZCBkZWxldGUgdHJhY2tzIHNpbXBseSBtb2RpZnkgdGhlIHBsYXlsaXN0IGFuZCBjYWxsIGN5bGluZGVyTGlzdFNlcnZpY2Uuc2F2ZShwbGF5bGlzdCk7XHJcbiAgICB0aGlzLnJhY3RpdmUub24oJ25ld1RyYWNrJywgKGUsIHVybCkgPT4ge1xyXG4gICAgICB0aGlzLnBsYXlsaXN0LnRyYWNrcy5wdXNoKHt1cmw6dXJsfSk7XHJcbiAgICAgIHRoaXMucGxheWxpc3RTZXJ2aWNlLnNhdmUodGhpcy5wbGF5bGlzdCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnJhY3RpdmUub24oJ2RlbGV0ZVRyYWNrJywgKGUsIGluZGV4KSA9PiB7XHJcbiAgICAgIHRoaXMucGxheWxpc3QudHJhY2tzLnNwbGljZShpbmRleCwxKTtcclxuICAgICAgdGhpcy5wbGF5bGlzdFNlcnZpY2Uuc2F2ZSh0aGlzLnBsYXlsaXN0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucmFjdGl2ZS5vbignYWRkRWRpdG9yJywgKGUsIHVzZXIpID0+IHtcclxuICAgICAgdGhpcy5wbGF5bGlzdC5lZGl0b3JzLnB1c2godXNlcilcclxuICAgICAgdGhpcy5wbGF5bGlzdFNlcnZpY2Uuc2F2ZSh0aGlzLnBsYXlsaXN0KVxyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzLnJhY3RpdmUub24oJ2xvZ291dCcsICgpID0+IHRoaXMubG9nb3V0KCkpO1xyXG5cclxuICAgIHRoaXMuc29ja2V0Lm9uKCdzYXZlZC1wbGF5bGlzdCcsIChwbCkgPT4gdGhpcy5zYXZlZFBsYXlsaXN0KHBsKSlcclxuICAgIHRoaXMuc29ja2V0Lm9uKCdkZWwtcGxheWxpc3QnLCAocGwpID0+IGNvbnNvbGUubG9nKCdnbyB0byBzb3JyeSBwYWdlJykpO1xyXG5cclxuICAgIHRoaXMuZ2V0UGxheWxpc3QodGhpcy5pZCk7XHJcblxyXG4gICAgbGV0IHJlYWR5SW50ID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgIGlmKFlUKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBuZXcgWVQuUGxheWVyKCdwbGF5ZXInLCB7XHJcbiAgICAgICAgICBoZWlnaHQ6ICcyOTMnLFxyXG4gICAgICAgICAgd2lkdGg6ICc0ODAnLFxyXG4gICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICdvblJlYWR5JzogZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICBldmVudC50YXJnZXQucGxheVZpZGVvKCk7XHJcbiAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIuY3VlVmlkZW9CeUlkKHNlbGYucGxheWxpc3QudHJhY2tzW3NlbGYuY3VycmVudFZpZF0udmlkZW9JZClcclxuICAgICAgICAgICAgICBzZWxmLnBsYXllci5wbGF5VmlkZW8oKTsgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ29uU3RhdGVDaGFuZ2UnOiBmdW5jdGlvbihldmVudCkgeyBcclxuICAgICAgICAgICAgICBpZiAoZXZlbnQuZGF0YSA9PSBZVC5QbGF5ZXJTdGF0ZS5FTkRFRCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0VOREVEJyk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRWaWQrKztcclxuICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLmN1ZVZpZGVvQnlJZChzZWxmLnBsYXlsaXN0LnRyYWNrc1tzZWxmLmN1cnJlbnRWaWRdLnZpZGVvSWQpXHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5wbGF5VmlkZW8oKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBjbGVhckludGVydmFsKHJlYWR5SW50KTtcclxuICAgICAgfVxyXG4gICAgfSwgNTAwKTtcclxuXHJcbiAgfVxyXG5cclxuICBzYXZlZFBsYXlsaXN0KHBsKSB7XHJcbiAgICBpZihwbC5faWQgPT0gdGhpcy5wbGF5bGlzdC5faWQpIHtcclxuICAgICAgdGhpcy5nZXRQbGF5bGlzdChwbC5faWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UGxheWxpc3QoaWQpIHtcclxuICAgIHRoaXMucGxheWxpc3RTZXJ2aWNlLmZpbmQoaWQsIHRoaXMubG9nZ2VkSW5Vc2VyLl9pZCkudGhlbigocGxheWxpc3QpID0+IHtcclxuICAgICAgY29uc29sZS5sb2cocGxheWxpc3QpXHJcbiAgICAgIHRoaXMucGxheWxpc3QgPSBwbGF5bGlzdDtcclxuICAgICAgdGhpcy5yYWN0aXZlLnNldCgncGxheWxpc3QnLCB0aGlzLnBsYXlsaXN0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaXNQcm90ZWN0ZWQoKXtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgbG9nb3V0KCkge1xyXG4gICAgdGhpcy5hdXRoLmNsZWFyTG9naW4oKTtcclxuICAgIHRoaXMuZXZlbnRzLnJvdXRpbmcudHJhbnNpdGlvblRvLmRpc3BhdGNoKCdsb2dpbicsIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgdW5yZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yYWN0aXZlLnRlYXJkb3duKCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQbGF5bGlzdDtcclxuIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo4LFwiclwiOlwibmF2YmFyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRhaW5lclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwicm93XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2wteHMtMTJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDFcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJwbGF5bGlzdC5uYW1lXCJ9XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInJvd1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sLXhzLTEyIGNvbC1tZC04IGNvbC1tZC1vZmZzZXQtMlwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZW1iZWQtcmVzcG9uc2l2ZSBlbWJlZC1yZXNwb25zaXZlLTE2Ynk5XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJlbWJlZC1yZXNwb25zaXZlLWl0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiaWRcIjpcInBsYXllclwifX1dfV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJyb3dcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbC1tZC05IGNvbC14cy0xMlwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcImNsYXNzXCI6XCJ0YWJsZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0aGVhZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGhcIixcImZcIjpbXCJUcmFja3NcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGhcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0aGVhZFwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRib2R5XCIsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlt7XCJ0XCI6MixcInJcIjpcInVybFwifV19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJ0aXRsZVwifV0sXCJuXCI6NTAsXCJyXCI6XCJ0aXRsZVwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJ1cmxcIn1dLFwiclwiOlwidGl0bGVcIn1dfV19LHtcInRcIjo0LFwiZlwiOltcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcInR5cGVcIjpcInN1Ym1pdFwiLFwiY2xhc3NcIjpcImdseXBoaWNvbiBnbHlwaGljb24tdHJhc2ggcHVsbC1yaWdodFwifSxcInZcIjp7XCJjbGlja1wiOntcIm5cIjpcImRlbGV0ZVRyYWNrXCIsXCJkXCI6W3tcInRcIjoyLFwiclwiOlwiaW5kZXhcIn1dfX19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwbGF5bGlzdC5pc093bmVyXCIsXCJwbGF5bGlzdC5pc0VkaXRvclwiXSxcInNcIjpcIl8wfHxfMVwifX1dfV0sXCJuXCI6NTIsXCJpXCI6XCJpbmRleFwiLFwiclwiOlwicGxheWxpc3QudHJhY2tzXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcInRleHRcIixcInBsYWNlaG9sZGVyXCI6XCJuZXcgdHJhY2tcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwibmV3VHJhY2tVcmxcIn1dLFwiY2xhc3NcIjpcImZvcm0tY29udHJvbFwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwic3VibWl0XCIsXCJjbGFzc1wiOlwiYnRuIGJ0bi1ibG9jayBidG4tc3VjY2VzcyBjZW50ZXItYmxvY2tcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJuXCI6XCJuZXdUcmFja1wiLFwiZFwiOlt7XCJ0XCI6MixcInJcIjpcIm5ld1RyYWNrVXJsXCJ9XX19LFwiZlwiOltcIkFkZFwiXX1dfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wicGxheWxpc3QuaXNPd25lclwiLFwicGxheWxpc3QuaXNFZGl0b3JcIl0sXCJzXCI6XCJfMHx8XzFcIn19XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbC1tZC0zIGNvbC14cy0xMlwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoNFwiLFwiZlwiOltcIk93bmVyXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsaXN0LWdyb3VwXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwibGlzdC1ncm91cC1pdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInBsYXlsaXN0Lm93bmVyLnVzZXJuYW1lXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImg0XCIsXCJmXCI6W1wiRWRpdG9yc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGlzdC1ncm91cFwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJsaXN0LWdyb3VwLWl0ZW1cIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidXNlcm5hbWVcIn1dfV0sXCJuXCI6NTIsXCJyXCI6XCJwbGF5bGlzdC5lZGl0b3JzXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwibGlzdC1ncm91cC1pdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwidGV4dFwiLFwicGxhY2Vob2xkZXJcIjpcIkFkZCBjb2xsYWJvcmF0b3JzXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaFRlcm1cIn1dLFwiY2xhc3NcIjpcImZvcm0tY29udHJvbFwifX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInBsYXlsaXN0LmlzT3duZXJcIixcInBsYXlsaXN0LmlzRWRpdG9yXCJdLFwic1wiOlwiXzB8fF8xXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJuXCI6XCJhZGRFZGl0b3JcIixcImRcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX19LFwiYVwiOntcImNsYXNzXCI6XCJsaXN0LWdyb3VwLWl0ZW1cIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidXNlcm5hbWVcIn1dfV0sXCJuXCI6NTIsXCJyXCI6XCJhZGRFZGl0b3JMaXN0XCJ9XX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzY3JpcHRcIixcImZcIjpbXCIgIHZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcXG4gIFxcbiAgdGFnLnNyYyA9IFxcXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9pZnJhbWVfYXBpXFxcIjtcXG4gIHZhciBmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcXG4gIGZpcnN0U2NyaXB0VGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRhZywgZmlyc3RTY3JpcHRUYWcpO1wiXX1dfSIsImNsYXNzIEF1dGgge1xyXG5cclxuICBjb25zdHJ1Y3RvcihodHRwLCBzdG9yZSwgZXZlbnRzLCBjb25maWcpIHtcclxuICAgIHRoaXMuaHR0cCA9IGh0dHA7XHJcbiAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcclxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gIH1cclxuXHJcbiAgbG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKSB7XHJcbiAgICAvLyBtYWtpbmcgdXNlIG9mIGVzNiBkZXN0cnVjdGluZyBoZXJlXHJcbiAgICBsZXQgcGF5bG9hZCA9ICh1c2VybmFtZSAmJiBwYXNzd29yZCkgPyB7dXNlcm5hbWUsIHBhc3N3b3JkfSA6IHVuZGVmaW5lZDtcclxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLmNvbmZpZy5hcGkgKyAnL3VzZXJzL2xvZ2luJywgcGF5bG9hZCkudGhlbigocmVzcG9uc2UpID0+IHtcclxuXHJcbiAgICAgIGxldCBhY2Nlc3NUb2tlbiA9IHJlc3BvbnNlLmRhdGEuYWNjZXNzVG9rZW47XHJcbiAgICAgIGxldCB1c2VyID0gcmVzcG9uc2UuZGF0YS51c2VyO1xyXG5cclxuICAgICAgdGhpcy5zdG9yZS5sb2NhbC5zZXQoJ2FjY2Vzc1Rva2VuJywgYWNjZXNzVG9rZW4pO1xyXG4gICAgICB0aGlzLnN0b3JlLm1lbW9yeS5zZXQoJ3VzZXInLCB1c2VyKTtcclxuXHJcbiAgICAgIHJldHVybiB1c2VyXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlc3RvcmVMb2dpbigpIHtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuY29uZmlnLmFwaSArICcvdXNlcnMvbG9naW4nKVxyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodGhpcy5jb25maWcuYXBpICsgJy91c2Vycy9sb2dpbicpLnRoZW4oXHJcbiAgICAgICAgKHJlc3BvbnNlKSAgPT4gIHtcclxuICAgICAgICAgIHRoaXMuc3RvcmUubWVtb3J5LnNldCgndXNlcicsIHJlc3BvbnNlLmRhdGEudXNlcik7XHJcbiAgICAgICAgICB0aGlzLmV2ZW50cy5hdXRoLnJlc3RvcmVkTG9naW4uZGlzcGF0Y2gobnVsbCwgcmVzcG9uc2UuZGF0YS51c2VyKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKGVycikgICA9PiB7XHJcbiAgICAgICAgICB0aGlzLmV2ZW50cy5hdXRoLnJlc3RvcmVkTG9naW4uZGlzcGF0Y2goZXJyKTtcclxuICAgICAgICB9KVxyXG4gIH1cclxuXHJcbiAgY2xlYXJMb2dpbigpIHtcclxuICAgIHRoaXMuc3RvcmUubG9jYWwucmVtb3ZlKCdhY2Nlc3NUb2tlbicpO1xyXG4gICAgdGhpcy5zdG9yZS5tZW1vcnkucmVtb3ZlKCd1c2VyJyk7XHJcbiAgfVxyXG5cclxuICBsb2dnZWRJblVzZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdG9yZS5tZW1vcnkuZ2V0KCd1c2VyJyk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBdXRoXHJcbiIsImltcG9ydCBzaWduYWxzIGZyb20gJ3NpZ25hbHMnO1xyXG5cclxuY2xhc3MgRXZlbnRzIHtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBcclxuICAgIHRoaXMuaHR0cCA9IHtcclxuICAgICAgZmFpbGVkUmVxdWVzdDogbmV3IHNpZ25hbHMuU2lnbmFsKClcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5yb3V0aW5nID0ge1xyXG4gICAgICB0cmFuc2l0aW9uVG86IG5ldyBzaWduYWxzLlNpZ25hbCgpLFxyXG4gICAgICBhY2Nlc3NEZW5pZWQ6IG5ldyBzaWduYWxzLlNpZ25hbCgpLFxyXG4gICAgICBub3RGb3VuZDogbmV3IHNpZ25hbHMuU2lnbmFsKClcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5hdXRoID0ge1xyXG4gICAgICByZXN0b3JlZExvZ2luOiBuZXcgc2lnbmFscy5TaWduYWwoKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEV2ZW50cygpO1xyXG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXHJcblxyXG5cclxuY29uc3QgZGVmYXVsdENvbmZpZ3VyYXRpb24gPSB7XHJcbiAgaXNGb3JtVmFsaWQ6ICdwYXJzbGV5VmFsaWQnLFxyXG4gIGZvY3VzOiAnbm9uZScsXHJcbiAgZXJyb3JDbGFzczogJ2hhcy1lcnJvcicsXHJcbiAgc3VjY2Vzc0NsYXNzOiAnaGFzLXN1Y2Nlc3MnLFxyXG4gIGNsYXNzSGFuZGxlcjogZnVuY3Rpb24oUGFyc2xleUZpZWxkKSB7XHJcbiAgICByZXR1cm4gUGFyc2xleUZpZWxkLiRlbGVtZW50LnBhcmVudHMoJy5mb3JtLWdyb3VwJyk7XHJcbiAgfSxcclxuICBlcnJvcnNDb250YWluZXI6IGZ1bmN0aW9uKFBhcnNsZXlGaWVsZCkge1xyXG4gICAgcmV0dXJuIFBhcnNsZXlGaWVsZC4kZWxlbWVudC5wYXJlbnRzKCcuZm9ybS1ncm91cCcpO1xyXG4gIH0sXHJcbiAgZXJyb3JzV3JhcHBlcjogJzxzcGFuIGNsYXNzPVwiaGVscC1ibG9ja1wiPicsXHJcbiAgZXJyb3JUZW1wbGF0ZTogJzxkaXY+PC9kaXY+J1xyXG59O1xyXG5cclxuXHJcbi8vIEEgZGVjb3JhdG9yIGZ1bmN0aW9uIHRha2VzIHR3byBhcmd1bWVudHMuIFRoZSBET00gZWxlbWVudCB0aGUgZGVjb3JhdG9yIHdhcyBjYWxsZWQgZnJvbVxyXG4vLyBhbmQgYW55IGFkZGl0aW9uYWwgYXJndW1lbnRzIGFkZGVkIHRvIHRoZSBkZWNvcmF0b3IgYXR0cmlidXRlIG9mIHRoYXQgZWxlbWVudC5cclxubGV0IHBhcnNsZXlEZWNvcmF0b3IgPSBmdW5jdGlvbihub2RlLCBjb250ZW50KSB7XHJcblxyXG4gIC8vIEhhdmUgbm90IGludmVzdGlnYXRlZCBhbnkgc291cmNlIGNvZGUgYnV0IGNvdWxkbid0IGZpbmQgYW55IGRvY3Mgc3RhdGluZyBjb250ZXh0XHJcbiAgLy8gb2YgaW52b2NhdGlvbiB3YXMgcmFjdGl2ZSBsaWJyYXJ5IEJVVCBzZWVtcyB0byB3b3JrLlxyXG4gIGxldCByYWN0aXZlID0gdGhpcztcclxuICBcclxuICAvLyB1c2UgcmFjdGl2ZSB0byBzZXQgdGhlIGRhdGEgbW9kZWwuIEluaXRpYWxseSBmb3JtIGlzIG5vdCB2YWxpZC4gXHJcbiAgcmFjdGl2ZS5zZXQocGFyc2xleURlY29yYXRvci5jb25maWcuaXNGb3JtVmFsaWQsIGZhbHNlKTtcclxuXHJcbiAgLy8gV2hlbiBwYXJzbGV5IGxvYWRzIGl0IHJlZ2lzdGVycyBpdHNlbGYgd2l0aCBqcXVlcnkgYW5kIGFkZHMgYSBwYXJzbGV5IGZ1bmN0aW9uLlxyXG4gIC8vIHRoaXMgZnVuY3Rpb24gY3JlYXRlcyBhIG5ldyBQYXJzbGV5RmFjdG9yeSBmcm9tIHRoZSBKUSBlbGVtZW50IGFuZCB0aGUgZXh0cmEgYXJndW1lbnRcclxuICAvLyBwYXNzZWQgZGlyZWN0bHkuXHJcbiAgbGV0IHBhcnNsZXlGb3JtID0gJChub2RlKS5wYXJzbGV5KHBhcnNsZXlEZWNvcmF0b3IuY29uZmlnKVxyXG5cclxuICAvLyBHZXRzIGFsbCB0aGUgaW5wdXQgZWxlbWVudHMgb2YgdGhlIGZvcm0uXHJcbiAgbGV0IGlucHV0RmllbGRzID0gJChub2RlKS5jaGlsZHJlbignLmZvcm0tZ3JvdXAnKS5jaGlsZHJlbignaW5wdXQnKSB8fCBbXVxyXG5cclxuICAvLyBGdW5jdGlvbiB0aGF0IHZhbGlkYXRlcyB0aGUgZnJvbSBhbmQgc2V0cyB0aGUgJ3BhcnNsZXlWYWxpZCcgbW9kZWwuXHJcbiAgZnVuY3Rpb24gdmFsaWRhdGUoKSB7XHJcbiAgICByYWN0aXZlLnNldChwYXJzbGV5RGVjb3JhdG9yLmNvbmZpZy5pc0Zvcm1WYWxpZCwgcGFyc2xleUZvcm0udmFsaWRhdGUoKSk7XHJcbiAgfVxyXG5cclxuICAvLyBhdHRhY2hlcyBhIGNhbGxiYWNrIHRvIHZhbGlkYXRlIHRoZSBmb3JtIHdoZW5ldmVyIHRoZSAnYmx1cicgb3IgJ2tleXVwJyBldmVudCBvY2N1clxyXG4gIC8vIGZvciBlYWNoIGlucHV0IGZpZWxkLlxyXG4gIF8uZm9yRWFjaChpbnB1dEZpZWxkcywgZWxlbSA9PiB7XHJcbiAgICAvLyBUaGUgYmx1ciBldmVudCBpcyBzZW50IHRvIGFuIGVsZW1lbnQgd2hlbiBpdCBsb3NlcyBmb2N1cy5cclxuICAgICQoZWxlbSkuYmx1cih2YWxpZGF0ZSk7XHJcbiAgICAkKGVsZW0pLmtleXVwKHZhbGlkYXRlKTtcclxuICB9KTtcclxuXHJcbiAgLy8gUmFjdGl2ZSByZXF1aXJlcyBkZWNvcmF0b3JzIHRvIHJldHVybiBhIHRlYXJkb3duIGZ1bmN0aW9uLiBUaGVcclxuICAvLyB0ZWFyZG93biBmdW5jdGlvbnMgZGVmaW5lcyBhbnkgYWN0aW9uIHJlcXVpcmVkIGlmIHRoZSBET00gZWxlbWVudFxyXG4gIC8vIGlzIHJlbW92ZWQuXHJcbiAgcmV0dXJuIHtcclxuICAgIHRlYXJkb3duOiBmdW5jdGlvbigpe1xyXG4gICAgICAvLyB1bmJpbmQgcmVtb3ZlcyBldmVudCBoYW5kbGVycy5cclxuICAgICAgXy5mb3JFYWNoKGlucHV0RmllbGRzLCBlbGVtID0+ICgkZWxlbSkudW5iaW5kKCkpO1xyXG4gICAgICBwYXJzbGV5Rm9ybS5kZXN0cm95KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxuLy8gQmVzdCBwcmFjdGlzZSB0byBhc3NpZ24gYW55IGRlY29yYXRvciB2YXJpYWJsZXMgYnkgYXR0YWNoaW5nIHRoZW0gdG8gdGhlIGZ1bmN0aW9uIFxyXG4vLyByYXRoZXIgdGhhbiBhZGRpbmcgdGhlbSBhcyBhIGxvbmcgc3RyaW5nIG9mIGFyZ3VtZW50cyB0byB0aGUgZGVjb3JhdG9yIGluIHRoZSBodG1sXHJcbnBhcnNsZXlEZWNvcmF0b3IuY29uZmlnID0gZGVmYXVsdENvbmZpZ3VyYXRpb247XHJcbmV4cG9ydCBkZWZhdWx0IHBhcnNsZXlEZWNvcmF0b3I7XHJcbiIsImltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5jbGFzcyBQbGF5bGlzdFNlcnZpY2Uge1xyXG5cclxuICAvLyBQYXNzIHRoZSBkb21haW4gbW9kZWwgZm9yIHBsYXlsaXN0cy4gXHJcbiAgY29uc3RydWN0b3IoUGxheWxpc3QpIHtcclxuICAgIHRoaXMuUGxheWxpc3QgPSBQbGF5bGlzdDtcclxuICB9XHJcblxyXG4gIGZpbmQgKGlkLCB1aWQpIHtcclxuICAgIHJldHVybiB0aGlzLlBsYXlsaXN0LmZpbmQoaWQpLnRoZW4oKHBsYXlsaXN0KSA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNldFBlcm1pc3Npb25zKHBsYXlsaXN0LCB1aWQpXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZpbmRBbGwgKHVpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuUGxheWxpc3QuZmluZEFsbCgpLnRoZW4oKHBsYXlsaXN0cykgPT4ge1xyXG4gICAgICByZXR1cm4gXy5tYXAocGxheWxpc3RzLCAocGwpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXRQZXJtaXNzaW9ucyhwbCwgdWlkKVxyXG4gICAgICB9KSAgXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldFBlcm1pc3Npb25zKHBsLCB1aWQpe1xyXG4gICAgaWYocGwub3duZXIuX2lkID09IHVpZCkge1xyXG4gICAgICBwbC5pc093bmVyID0gdHJ1ZVxyXG4gICAgfVxyXG4gICAgaWYoXy5maW5kKHBsLmVkaXRvcnMsIHtfaWQ6IHVpZH0pKSB7XHJcbiAgICAgIHBsLmlzRWRpdG9yID0gdHJ1ZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBsXHJcbiAgfVxyXG5cclxuICAvLyBDcmVhdGUgYW5kIHJldHVybiBhIG5ldyBwbGF5bGlzdC5cclxuICBhZGQgKHBsYXlsaXN0KSB7XHJcbiAgICBwbGF5bGlzdCA9IG5ldyB0aGlzLlBsYXlsaXN0KHBsYXlsaXN0KTtcclxuICAgIHJldHVybiBwbGF5bGlzdC5zYXZlICgpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlIChwbGF5bGlzdCkge1xyXG4gICAgcmV0dXJuIHBsYXlsaXN0ICYmIHBsYXlsaXN0LmRlbCgpO1xyXG4gIH1cclxuXHJcbiAgc2F2ZSAocGxheWxpc3QpIHtcclxuICAgIHJldHVybiBwbGF5bGlzdCAmJiBwbGF5bGlzdC5zYXZlKCk7XHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQbGF5bGlzdFNlcnZpY2U7XHJcbiIsImltcG9ydCBjcm9zc3JvYWRzIGZyb20gJ2Nyb3Nzcm9hZHMnO1xyXG5pbXBvcnQgaGFzaGVyIGZyb20gJ2hhc2hlcic7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5jbGFzcyBSb3V0ZXIge1xyXG5cclxuICBjb25zdHJ1Y3RvcihhdXRoLCBldmVudHMpIHtcclxuICAgIHRoaXMuYXV0aCA9IGF1dGg7XHJcbiAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcclxuICB9XHJcblxyXG4gIGluaXRpYWxpc2UoKSB7XHJcbiAgICAvLyBsb29rcyBsaWtlIGhhc2hlciB3YXRjaGVzIGhhc2ggYW5kIGVtaXRzIHNpZ25hbHNcclxuICAgIC8vIEhlcmUgd2UgZGVjbGFyZSBob3cgdG8gaGFuZGxlIGluaXRpYWwgaGFzaCBhbmQgYW55XHJcbiAgICAvLyBmdXJ0aGVyIGNoYW5nZXMuXHJcbiAgICBoYXNoZXIuaW5pdGlhbGl6ZWQuYWRkKHRoaXMucGFyc2VIYXNoKTtcclxuICAgIGhhc2hlci5jaGFuZ2VkLmFkZCh0aGlzLnBhcnNlSGFzaCk7XHJcbiAgICBoYXNoZXIuaW5pdCgpO1xyXG5cclxuICAgIC8vIGJ5cGFzc2VkIGNhbGxiYWNrcyBhcmUgcnVuIGV2ZXJ5dGltZSBhIHJvdXRlIGN1b2xkIG5vdCBiZSBmb3VuZCB0byBtYXRjaCB0aGUgcmVxdWVzdC5cclxuICAgIC8vIFdyaXRpbmcgbGlrZSB0aGlzIGNhcHR1cmUgdGhpcyBpbiB0aGUgY2xvc3VyZT9cclxuICAgIGNyb3Nzcm9hZHMuYnlwYXNzZWQuYWRkKCgpID0+IHRoaXMuYnlwYXNzZWRIYW5kbGVyKCkpO1xyXG4gIH1cclxuXHJcbiAgYWRkUm91dGUocGF0aCwgdmlldykge1xyXG4gICAgLy8gYWRkUm91dGUgbWV0aG9kIHRvIHJlZ2lzdGVyIGEgaGFuZGxlciB0byBhIHBhdGguIFxyXG4gICAgLy8gSGVyZSwgXy5iaW5kIHNldHMgdGhlIGZ1bmN0aW9uIGludm9jYXRpb24gY29udGV4dCAodGhpcykgb2Ygdmlldy5yZW5kZXIgdG8gdmlld1xyXG4gICAgXHJcbiAgICB2aWV3LnJlbmRlcl9oID0gKCkgPT4ge1xyXG4gICAgICB2aWV3LnJlbmRlcihoYXNoZXIuZ2V0SGFzaCgpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbGV0IHJvdXRlID0gY3Jvc3Nyb2Fkcy5hZGRSb3V0ZShwYXRoLCBfLmJpbmQodmlldy5yZW5kZXJfaCwgdmlldykpO1xyXG4gICAgXHJcbiAgICAvLyBBdHRhY2ggYSBoYW5kbGVyIGZvciB0aGUgc3dpdGNoIGV2ZW50XHJcbiAgICByb3V0ZS5tYXRjaGVkLmFkZCgoKSA9PiB0aGlzLm1hdGNoZWRIYW5kbGVyKHBhdGgsIHZpZXcpKTtcclxuICAgIHJvdXRlLnN3aXRjaGVkLmFkZCgoKSA9PiB0aGlzLnN3aXRjaGVkSGFuZGxlcih2aWV3KSk7XHJcbiAgfVxyXG5cclxuICBieXBhc3NlZEhhbmRsZXIoKXtcclxuICAgIHRoaXMuZXZlbnRzLnJvdXRpbmcubm90Rm91bmQuZGlzcGF0Y2goKTtcclxuICB9XHJcblxyXG4gIHN3aXRjaGVkSGFuZGxlcih2aWV3KSB7XHJcbiAgICB2aWV3LnVucmVuZGVyKCk7XHJcbiAgfVxyXG5cclxuICBtYXRjaGVkSGFuZGxlcihwYXRoLCB2aWV3KSB7XHJcbiAgICBpZih2aWV3LmlzUHJvdGVjdGVkKCkgJiYgIXRoaXMuYXV0aC5sb2dnZWRJblVzZXIoKSkge1xyXG4gICAgICB2aWV3LnVucmVuZGVyKCkudGhlbigoKSA9PiB0aGlzLmV2ZW50cy5yb3V0aW5nLmFjY2Vzc0RlbmllZC5kaXNwYXRjaChwYXRoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwYXJzZUhhc2gobmV3SGFzaCwgb2xkSGFzaCkge1xyXG4gICAgLy8gV2hlbmV2ZXIgdGhlIGhhc2ggY2hhbmdlcyBjcm9zc3JvYWRzIHdpbGwgcGVyZm9ybSByb3V0aW5nXHJcbiAgICAvLyBiYXNlZCBvbiBjb25maWd1cmVkIHJvdXRlcy4gUmVuZGVyaW5nIGFuZCB0ZWFyaW5nIGRvd24gcGFnZXMuXHJcbiAgICBjcm9zc3JvYWRzLnBhcnNlKG5ld0hhc2gpXHJcbiAgfVxyXG5cclxuICBjdXJyZW50SGFzaCgpIHtcclxuICAgIHJldHVybiBoYXNoZXIuZ2V0SGFzaCgpO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNpdGlvblRvKHBhdGgpe1xyXG4gICAgaGFzaGVyLnNldEhhc2gocGF0aCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSb3V0ZXJcclxuIiwiaW1wb3J0IHN0b3JlIGZyb20gJ3N0b3JlJztcclxuXHJcbmNsYXNzIEluTWVtb3J5IHtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnN0b3JlID0ge31cclxuICB9XHJcblxyXG4gIHNldChrZXksIHZhbHVlKSB7XHJcbiAgICB0aGlzLnN0b3JlW2tleV0gPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldChrZXkpIHtcclxuICAgIHJldHVybiB0aGlzLnN0b3JlW2tleV07XHJcbiAgfVxyXG5cclxuICByZW1vdmUoa2V5KSB7XHJcbiAgICBkZWxldGUgdGhpcy5zdG9yZVtrZXldO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbmNsYXNzIExvY2FsIHtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgfVxyXG5cclxuICBzZXQoa2V5LCB2YWx1ZSkge1xyXG4gICAgdGhpcy5zdG9yZS5zZXQoa2V5LCB2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBnZXQoa2V5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdG9yZS5nZXQoa2V5KTtcclxuICB9XHJcblxyXG4gIHJlbW92ZShrZXkpIHtcclxuICAgIHRoaXMuc3RvcmUucmVtb3ZlKGtleSk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBTdG9yYWdlIHtcclxuICBcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgdGhpcy5sb2NhbCA9IG5ldyBMb2NhbCgpO1xyXG4gICAgdGhpcy5tZW1vcnkgPSBuZXcgSW5NZW1vcnkoKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBTdG9yYWdlO1xyXG4iLCJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuY2xhc3MgVXNlclNlcnZpY2Uge1xyXG5cclxuICAvLyBQYXNzIHRoZSBkb21haW4gbW9kZWwgZm9yIHBsYXlsaXN0cy4gXHJcbiAgY29uc3RydWN0b3IoVXNlcikge1xyXG4gICAgdGhpcy5Vc2VyID0gVXNlcjtcclxuICB9XHJcblxyXG4gIGZpbmQgKGlkKSB7XHJcbiAgICByZXR1cm4gdGhpcy5Vc2VyLmZpbmQoaWQpO1xyXG4gIH1cclxuXHJcbiAgZmluZEFsbCAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5Vc2VyLmZpbmRBbGwoKTtcclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBVc2VyU2VydmljZTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIGFwaTogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGknXHJcbn1cclxuXHJcbiJdfQ==
