import storage from 'services/storage';


describe('Storage service', function() {

  it('should exist and be importable', function() {
    expect(storage).toBeDefined();
  });

  describe('In memory', function() {
    
    it('should return undefined if a key does not exist', function() {
      expect(storage.memory.get('no-such-key')).toBeUndefined();
    });

    it('should set a key value pair', function() {
      storage.memory.set('name', 'jack');
      expect(storage.memory.get('name')).toEqual('jack');

      storage.memory.set('age', 1000);
      expect(storage.memory.get('age')).toEqual(1000);
    });

    it('should remove a key', function() {
      storage.memory.set('age', 1000);
      storage.memory.remove('age');
      expect(storage.memory.get('age')).toBeUndefined();
    });

  });

  describe('Local', function() {

    it('should return undefined if a key does not exist', function() {
      expect(storage.local.get('no-such-key')).toBeUndefined();
    });

    it('should set a key value pair', function() {
      storage.local.set('name', 'jack');
      expect(storage.local.get('name')).toEqual('jack');

      storage.local.set('age', 1000);
      expect(storage.local.get('age')).toEqual(1000);
    });

    it('should remove a key', function() {
      storage.local.set('age', 1000);
      storage.local.remove('age');
      expect(storage.local.get('age')).toBeUndefined();
    });


  });

});
