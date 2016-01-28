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

if (program.args.length > 0) {
  program.args.forEach(function forEach(arg) {
    rollupBabelLibBundler({
      name: libName,
      moduleName: moduleName,
      dest: dest,
      entry: arg,
      format: format,
    });
  });
}
