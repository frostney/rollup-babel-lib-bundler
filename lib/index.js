// TODO: ES2015 maybe, baby?

var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var camelCase = require('camel-case');

var pkg = require('./package.json');
var name = pkg.name;
var moduleName = 'ReactLibStarterkit';

var formats = ['es6', 'cjs', 'umd'];

module.exports = function(options) {
  // TODO: Hmm, a voice in my head says we shouldn't modify arguments
  options = options || {};

  options.name = options.name || 'mylibrary';
  // TODO: If we go about using Object.assign instead of modifying `options`,
  //  we should have some way of taking `name` from `moduleName` without it
  //  being too hack-y
  options.moduleName = options.moduleName || camelCase(options.name);
  options.dest = options.dest || 'dist';
  options.entry = options.entry || 'index.js';
  options.format = options.format || ['es6', 'cjs', 'umd'];
  options.plugins = options.plugins || [babel()];


  var baseConfig = {
    entry: options.entry,
    plugins: options.plugins,
  };

  var builds = formats.map(function(format) {
    var config = Object.assign({}, baseConfig);

    config.format = format;
    config.dest = options.dest + '/' + name;

    if (format === 'es6') {
      config.dest += '.es2015';
    }

    if (format === 'umd') {
      config.dest += '.umd';
      config.moduleName = options.moduleName;
    }

    config.dest += '.js';

    return rollup.rollup(config).then(function(bundle) {
      bundle.write(config);
    });
  });

  return Promise.all(builds).then(function() {
    console.log('All done!');
  }).catch(function(err) {
    console.log('Error while generating a build:');
    console.log(err);
  });
};
