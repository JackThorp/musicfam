import store from 'store';

class InMemory {

  constructor() {
    this.store = {}
  }

  set(key, value) {
    this.store[key] = value;
  }

  get(key) {
    return this.store[key];
  }

  remove(key) {
    delete this.store[key];
  }

}

class Local {

  constructor() {
    this.store = store;
  }

  set(key, value) {
    this.store.set(key, value);
  }

  get(key) {
    return this.store.get(key);
  }

  remove(key) {
    this.store.remove(key);
  }
}

class Storage {
  
  constructor(){
    this.local = new Local();
    this.memory = new InMemory();
  }
}

export default new Storage;
