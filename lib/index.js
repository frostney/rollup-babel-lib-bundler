// TODO: ES2015 maybe, baby?
var path = require('path');

var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var json = require('rollup-plugin-json');
var camelCase = require('camel-case');
var objectAssign = require('object-assign');

var Promise = (typeof Promise === 'undefined') ? require('pinkie-promise') : Promise;

var formats = ['es6', 'cjs', 'umd'];

module.exports = function rollupLib(options) {
  var rollupOptions = objectAssign({}, options);

  var baseConfig = {};
  var builds = [];

  rollupOptions.name = rollupOptions.name || 'mylibrary';
  rollupOptions.moduleName = rollupOptions.moduleName || camelCase(rollupOptions.name);
  rollupOptions.dest = rollupOptions.dest || 'dist';
  rollupOptions.entry = rollupOptions.entry || 'index.js';
  rollupOptions.format = rollupOptions.format || ['es6', 'cjs', 'umd'];

  if (rollupOptions.format.length === 0) {
    rollupOptions.format = ['es6', 'cjs', 'umd'];
  }

  rollupOptions.plugins = rollupOptions.plugins || [babel(), json()];

  baseConfig = {
    entry: rollupOptions.entry,
    plugins: rollupOptions.plugins
  };

  builds = formats.map(function buildFormat(format) {
    var startTime = Date.now();
    var config = objectAssign({}, baseConfig);

    config.format = format;
    config.dest = path.join(rollupOptions.dest, rollupOptions.name);

    if (format === 'es6') {
      config.dest += '.es2015';
    }

    if (format === 'umd') {
      config.dest += '.umd';
      config.moduleName = rollupOptions.moduleName;
    }

    config.dest += '.js';

    return rollup.rollup(config).then(function rollupBundle(bundle) {
      var endTime = 0;

      bundle.write(config);

      endTime = Date.now();

      return {
        format: format,
        name: rollupOptions.name,
        startTime: startTime,
        endTime: endTime
      };
    });
  });

  return Promise.all(builds);
};
