import crossroads from 'crossroads';
import hasher from 'hasher';
import _ from 'lodash';

class Router {

  initialise() {
    // looks like hasher watches hash and emits signals
    // Here we declare how to handle initial hash and any
    // further changes.
    hasher.initialized.add(this.parseHash);
    hasher.changed.add(this.parseHash);
    hasher.init();
  }

  addRoute(path, view) {
    // addRoute method to register a handler to a path. 
    // Here, _.bind sets the function invocation context (this) of view.render to view
    let route = crossroads.addRoute(path, _.bind(view.render, view));
    
    // Attach a handler for the switch event
    route.switched.add(() => this.switchedHandler(view));
  }

  switchedHandler(view) {
    view.unrender();
  }

  parseHash(newHash, oldHash) {
    // Whenever the hash changes crossroads will perform routing
    // based on configured routes. Rendering and tearing down pages.
    console.log('parsing hash: ' + newHash);
    crossroads.parse(newHash)
  }
}

export default Router
