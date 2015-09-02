class Auth {

  constructor(http, store, events, config) {
    this.http = http;
    this.store = store;
    this.events = events;
    this.config = config;
  }

  login(username, password) {
    // making use of es6 destructing here
    let payload = (username && password) ? {username, password} : undefined;
    return this.http.post(this.config.api + '/users/login', payload).then((response) => {

      let accessToken = response.data.accessToken;
      let user = response.data.user;

      this.store.local.set('accessToken', accessToken);
      this.store.memory.set('user', user);

      return user
    });
  }

  restoreLogin() {
    return this.http.get(this.config.api + '/users/login').then(
        (user)  =>  {
          this.store.memory.set('user', user);
          this.events.auth.restoredLogin.dispatch(null, user)
        },
        (err)   => this.events.auth.restoredLogin.dispatch(err));
  }

  clearLogin() {
    this.store.local.remove('accessToken');
    this.store.memory.remove('user');
  }

  loggedInUser() {
    return this.store.memory.get('user');
  }
}

export default Auth
