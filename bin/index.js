#!/usr/bin/env node

var fs = require('fs');

var program = require('commander');

var path = require('path');
var pkg = require('../package.json');
var rollupBabelLibBundler = require('../lib');

var libPkg = null;
var libName = '';
var moduleName = '';
var dest = '';
var format = '';
var entry = '';
var files = [];
var packageConfig = {};
var babelOptions = null;

var packageFile = path.resolve(process.cwd(), './package.json');

var stats = (function statsIIFE() {
  try {
    return fs.statSync(packageFile);
  } catch (e) {
    return null;
  }
})();

if (stats && stats.isFile()) {
  libPkg = require(packageFile);
  libName = libPkg.name;
  packageConfig = libPkg.rollupBabelLibBundler || {};

  if (libPkg['jsnext:main']) {
    entry = ['jsnext:main'];
  }
}

program.version(pkg.version)
  .usage('[options] <file ...>')
  .option('-n, --lib-name <libName>',
    'Library name (defaults to `name` from `package.json` if available)')
  .option('--module-name <moduleName>', 'Module name for UMD build')
  .option('-f, --format <format>', 'Build formats (comma separated; default: es6,umd,cjs)')
  .option('-d, --dest <dest>', 'Destination')
  .parse(process.argv);

libName = program.libName || libName || 'library';
moduleName = program.moduleName || packageConfig.moduleName || moduleName;
format = program.format || packageConfig.format || format;
dest = program.dest || packageConfig.dest || dest;
babelOptions = packageConfig.babel || babelOptions;

files = program.args;
if (files.length === 0) {
  files = [entry];
}

if (files.length > 0) {
  files.forEach(function forEach(arg) {
    var bundleFormat = (function (f) {
      if (!f) {
        return void 0;
      }

      if (typeof f === 'string') {
        return f.split(',');
      }

      return format;
    })(format);

    rollupBabelLibBundler({
      name: libName,
      moduleName: moduleName,
      dest: dest,
      entry: arg,
      format: bundleFormat,
      babel: babelOptions
    }).then(function buildThen(builds) {
      console.log('All done!');

      builds.forEach(function buildForEach(buildStats) {
        var moduleFormat = buildStats.format.toUpperCase();
        var buildName = buildStats.name;
        var duration = buildStats.endTime - buildStats.startTime;

        // TODO: I really miss template strings here.
        var o = 'Built ' + moduleFormat + ' module for ' + buildName + '. Took ' + duration + ' ms';

        console.log(o);
      });
    }).catch(function buildCatch(err) {
      console.log('Error while generating a build:');

      if (err.stack) {
        console.error(err.stack);
      } else {
        if (err.message) {
          console.error(err.message);
        }
      }

      process.exit(1);
    });
  });
} else {
  console.log('No files specified');
}
