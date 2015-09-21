import Ractive from 'ractive'
import html from './login.ract'

class Login {

  constructor(auth, events, socket) {
    this.auth = auth;
    this.events = events;
    this.socket = socket;
  }

  render() {

    this.ractive = new Ractive({
      el: '#view',
      template: html,
      data: {
        showError: false
      }
    });

    this.ractive.on('signIn', () => {
      let username = this.ractive.get('username');
      let password = this.ractive.get('password');
      this.signIn(username, password);
    });

    this.ractive.on('signUp', () => {
      let username = this.ractive.get('username');
      let password = this.ractive.get('password'); 
      this.signUp(username, password);
    })
        
  }

  signIn(username, password) {
    this.auth.login(username, password)
      .then((user) => this.goToHomeScreen())
      .catch((err) => this.showError(err));
  }

  signUp(username, password) {
    this.auth.signUp(username, password)
      .then((user) => this.goToHomeScreen())
      .catch((err) => this.showError(err));
  }

  showError(err) {
    this.ractive.set('error', err.data.message);
  }

  goToHomeScreen() {
    console.log('boom')
    this.events.routing.transitionTo.dispatch('home', this);
  } 

  isProtected() {
    return false;
  }

  unrender() {
    return this.ractive.teardown();
  }

}

export default Login
