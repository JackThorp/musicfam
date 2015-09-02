module.exports.libs = [ 
  'lodash',
  'axios',
  'crossroads',
  'ractive',
  'hasher',
  'signals',
  'bootstrap',
  'store',
  'parsleyjs',
  'logdown'
];

module.exports.paths = {

  js: {
    src: './src/js/app.es6',
    dest: './dist/js/',
    watch: ['./src/**/*.es6', './src/**/*.ract']
  },

  ract: {
    watch: ['./src/**/*.ract']
  },

  html: {
    src: './src/index.html',
    dest: './dist/'
  },

  jade: {
    src: './src/js/**/*.jade',
    dest: './src/js',
    watch: ['./src/**/*.jade']
  },

  less: {
    src: './src/css/styles.less',
    dest: './dist/css',
    watch: ['./src/**/*.less']
  },

  jquery: {
    src: './node_modules/jquery/dist/jquery.min.js',
    dest: './dist/js/'
  }
}

module.exports.__testdir = '/test';

