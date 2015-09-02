import Ractive from 'ractive'
import html from './login.ract'

class Login {

  constructor(auth, events) {
    this.auth = auth;
    this.events = events;
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
        
  }

  signIn(username, password) {
    this.auth.login(username, password)
      .then((user) => this.goToHomeScreen(),
            (err) => this.showError(err))
  }

  showError(err) {
    this.ractive.set('showError', true);
  }

  goToHomeScreen() {
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
