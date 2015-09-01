import Ractive from 'ractive'
import html from './login.ract'

class Login {

  constructor(config) {

  }

  render() {

    this.ractive = new Ractive({
      el: '#view',
      template: html
    });

  }

  unrender() {
    this.ractive.teardown();
  }

}

export default Login
