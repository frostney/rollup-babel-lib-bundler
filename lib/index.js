// TODO: ES2015 maybe, baby?

var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var camelCase = require('camel-case');

var formats = ['es6', 'cjs', 'umd'];

module.exports = function rollupLib(options) {
  var rollupOptions = Object.assign({}, options);
  var baseConfig = {};
  var builds = [];

  rollupOptions.name = rollupOptions.name || 'mylibrary';
  // TODO: If we go about using Object.assign instead of modifying `options`,
  //  we should have some way of taking `name` from `moduleName` without it
  //  being too hack-y
  rollupOptions.moduleName = rollupOptions.moduleName || camelCase(options.name);
  rollupOptions.dest = rollupOptions.dest || 'dist';
  rollupOptions.entry = rollupOptions.entry || 'index.js';
  rollupOptions.format = rollupOptions.format || ['es6', 'cjs', 'umd'];
  rollupOptions.plugins = rollupOptions.plugins || [babel()];


  baseConfig = {
    entry: rollupOptions.entry,
    plugins: rollupOptions.plugins,
  };

  builds = formats.map(function buildFormat(format) {
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

    return rollup.rollup(config).then(function rollupBundle(bundle) {
      bundle.write(config);
    });
  });

  return Promise.all(builds).then(function buildThen() {
    console.log('All done!');
  }).catch(function buildCatch(err) {
    console.log('Error while generating a build:');
    console.log(err);
  });
};
