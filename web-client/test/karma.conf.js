// Karma configuration
// Generated on Thu Aug 20 2015 17:30:32 GMT+0100 (BST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'jasmine'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '../src/**/*.es6': ['browserify'],
      'unit/**/*.es6': ['browserify']
    },

    browserify: {
      debug: true,
      paths: ['../node_modules', '../src/js'],
      transform: [['ractivate', {extensions: ['.ract']}], 'babelify'],
      extensions: ['.ract', '.es6'],
      configure: function(bundle) {
        bundle.on('prebundle', function() {
          bundle.add('../config-dev.es6', {expose: 'configuration'});
        });
      }
    },

    // list of files / patterns to load in the browser
    files: [
      '../node_modules/jasmine-ajax/lib/mock-ajax.js',
      '../node_modules/jquery/dist/jquery.min.js',  
      '../src/**/*.es6',
      'unit/**/*.es6'
    ],


    // list of files to exclude
    exclude: [
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    plugins: [
      'karma-browserify',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-spec-reporter'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
