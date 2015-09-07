import axios from 'axios';

import Auth from 'services/auth.es6';
import storage from 'services/storage.es6';
import events from 'services/events.es6';

describe('authentication service', function() {

  let auth;

  beforeEach(function(){
    auth = new Auth(axios, storage, events, {api: 'http://stub.com'});
    jasmine.Ajax.install();
  });

  afterEach(function(){
    jasmine.Ajax.uninstall();
  });

  it('should exist and be importable', function() {
    expect(Auth).toBeDefined();
  });

  it('should authenticate a valid user successfully', function(done) {
    
    jasmine.Ajax.stubRequest('http://stub.com/users/login').andReturn({
      'status': 200,
      'contentType': 'application/json',
      'responseText': JSON.stringify({
        'accessToken': 'afeas',
        'user': { firstname: 'John'}
      })
    });
   
    auth.login('username', 'password').then((user) => {
      expect(storage.memory.get('user').firstname).toBe('John');
      done();
    });

  });


});
