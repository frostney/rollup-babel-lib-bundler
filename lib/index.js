// TODO: ES2015 maybe, baby?
var path = require('path');

var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var json = require('rollup-plugin-json');
var localResolve = require('rollup-plugin-local-resolve');
var camelCase = require('camel-case');
var objectAssign = require('object-assign');

var Promise = (typeof Promise === 'undefined') ? require('pinkie-promise') : Promise;

module.exports = function rollupLib(options) {
  var rollupOptions = objectAssign({}, options);
  var babelOptions;

  var baseConfig = {};
  var builds = [];
  var postfixDefaults = {
    cjs: '',
    es6: '.es2015',
    umd: '.umd',
    iife: '.iife'
  };

  rollupOptions.name = rollupOptions.name || 'mylibrary';
  rollupOptions.moduleName = rollupOptions.moduleName || camelCase(rollupOptions.name);
  rollupOptions.dest = rollupOptions.dest || 'dist';
  rollupOptions.entry = rollupOptions.entry || 'index.js';
  rollupOptions.format = rollupOptions.format || ['es6', 'cjs', 'umd'];
  rollupOptions.babel = rollupOptions.babel || 'inherit';
  rollupOptions.postfix = objectAssign(postfixDefaults, rollupOptions.postfix);

  babelOptions = (rollupOptions.babel === 'inherit') ? void 0 : rollupOptions.babel;

  if (babelOptions) {
    babelOptions.babelrc = false;
  }

  rollupOptions.plugins = rollupOptions.plugins || [babel(babelOptions), json(), localResolve()];

  baseConfig = {
    entry: rollupOptions.entry,
    plugins: rollupOptions.plugins
  };

  builds = rollupOptions.format.map(function buildFormat(format) {
    var startTime = Date.now();
    var config = objectAssign({}, baseConfig);

    config.format = format;
    config.dest = path.join(rollupOptions.dest, rollupOptions.name);
    config.dest += rollupOptions.postfix[format];
    config.dest += '.js';

    if (format === 'umd' || format === 'iife') {
      config.moduleName = rollupOptions.moduleName;
    }

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
