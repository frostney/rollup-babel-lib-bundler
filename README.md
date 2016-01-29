# rollup-babel-lib-bundler
Utility to bundle JavaScript libraries with Rollup

[![Build Status](https://travis-ci.org/frostney/rollup-babel-lib-bundler.svg?branch=master)](https://travis-ci.org/frostney/rollup-babel-lib-bundler) [![Dependency Status](https://david-dm.org/frostney/rollup-babel-lib-bundler.svg)](https://david-dm.org/frostney/rollup-babel-lib-bundler) [![devDependency Status](https://david-dm.org/frostney/rollup-babel-lib-bundler/dev-status.svg)](https://david-dm.org/frostney/rollup-babel-lib-bundler#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/frostney/rollup-babel-lib-bundler/badge.svg?branch=master)](https://coveralls.io/github/frostney/rollup-babel-lib-bundler?branch=master)

As a library author, I always wanted to have a utility where I put in a file and I get a library for all the formats I want to distribute.
(Ideally, it should pick up my Babel config and the library name from the `package.json`.)

Originally, this started as a build script in one of open source projects, but then I needed it in other projects as well. That's when it became a NPM module.

I really like Rollup's idea of not scoping each module individually which is closer to my perception of what the library what would look like if I were to write by hand without modules.

## Installation
```
$ npm install rollup-babel-lib-bundler
```

## Usage

Rollup requires a rollup-compatible Babel config. Simply change the `es2015` preset to `es2015-rollup` or `es2015-loose` to `es2015-loose-rollup`.

![usage](https://github.com/frostney/rollup-babel-lib-bundler/blob/master/docs/usage.gif)

### Command-line
```
rollup-babel-lib-bundler ./myFancyLibrary.js
```

### JavaScript API
```javascript
var rollupBabelLibBundler = require('rollup-babel-lib-bundler');

rollupBabelLibBundler({
  name: 'myfancylibrary',
  moduleName: 'myFancyLibrary',
  dest: 'dist',
  entry: './myFancyLibrary.js',
  format: ['cjs', 'umd', 'es6'],
});
```

#### options.name
###### Type `String`  
The name of the library. Will be used for the generated filenames.

#### options.moduleName
###### Type: `String`  
This is needed for the UMD build. This is the property the library will bind itself to the global object. If omitted, it will automatically use `options.name` as camel case.

#### options.dest
###### Type: `String`  
The directory where the files will be generated to.

#### options.entry
###### Type: `String`  
The path to the library itself.

#### options.format
###### Type: `Array`  
Can be `umd`, `es6` or `cjs` or a combination of these.

#### Return value
###### Type: `Promise`
This returns a promise with an array of objects which can

```javascript
{
  name: String, // The module name
  format: String, // The module format (es6, umd, cjs)
  endTime: Number, // The time where this module finished generating
  startTime: Number, // The time before the generating process started
}
```

## License
MIT
