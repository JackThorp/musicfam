module.exports.libs = [ 
  'lodash',
  'ractive',
  'bootstrap'
];

module.exports.paths = {

  js: {
    src: './src/js/app.es6',
    dest: './dist/js/',
    watch: ['./src/**/*.es6', './src/**/*.ract']
  },

  html: {
    src: './src/index.html',
    dest: './dist/'
  }

}



