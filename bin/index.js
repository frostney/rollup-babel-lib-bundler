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
var format = [];
var entry = '';
var files = [];

var packageFile = path.resolve(process.cwd(), './package.json');

var stats = fs.statSync(packageFile);

if (stats.isFile()) {
  libPkg = require(packageFile);
  libName = libPkg.name;
}

program.version(pkg.version)
  .usage('[options] <file ...>')
  .option('-n, --name <libName>', 'Library name')
  .option('--module-name <moduleName>', 'Module name for UMD build')
  .option('-f, --formats <format>', 'Build formats (comma separated; default: es6,umd,cjs)')
  .option('-d, --dest <dest>', 'Destination')
  .parse(process.argv);

libName = program.libName || libName || 'library';
moduleName = program.moduleName || moduleName;
format = program.format || format;
dest = program.dest || dest;

files = program.args;
if (files.length === 0) {
  files = [entry];
}

if (files.length > 0) {
  files.forEach(function forEach(arg) {
    rollupBabelLibBundler({
      name: libName,
      moduleName: moduleName,
      dest: dest,
      entry: arg,
      format: format,
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
      console.error(err);

      process.exit(1);
    });
  });
} else {
  console.log('No files specified');
}
