module.exports.libs = [ 
  'lodash',
  'axios',
  'crossroads',
  'ractive',
  'hasher',
  'signals',
  'bootstrap'
];

module.exports.paths = {

  js: {
    src: './src/js/app.es6',
    dest: './dist/js/',
    watch: ['./src/**/*.es6', './src/**/*.ract']
  },

  jade: {
    src: './src/index.jade',
    dest: './dist/'
  },

  less: {
    src: './src/css/styles.less',
    dest: './dist/css',
    watch: ['./src/**/*.less']
  }
}

module.exports.__testdir = '/test';

