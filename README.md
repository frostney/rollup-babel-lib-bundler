# rollup-babel-lib-bundler
Utility to bundle JavaScript libraries with Rollup

[![Build Status](https://travis-ci.org/frostney/rollup-babel-lib-bundler.svg?branch=master)](https://travis-ci.org/frostney/rollup-babel-lib-bundler) [![Dependency Status](https://david-dm.org/frostney/rollup-babel-lib-bundler.svg)](https://david-dm.org/frostney/rollup-babel-lib-bundler) [![devDependency Status](https://david-dm.org/frostney/rollup-babel-lib-bundler/dev-status.svg)](https://david-dm.org/frostney/rollup-babel-lib-bundler#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/frostney/rollup-babel-lib-bundler/badge.svg?branch=master)](https://coveralls.io/github/frostney/rollup-babel-lib-bundler?branch=master)

As a library author, I always wanted to have a utility where I put in a file and I get a library for all the formats I want to distribute.
(Ideally, it should pick up my Babel config and the library name from the `package.json`.)

Originally, this started as a build script in one of open source projects, but then I needed it in other projects as well. That's when it became a NPM module.

I really like Rollup's idea of not scoping each module individually which is closer to my perception of what the library what would look like if I were to write the library by hand without modules.

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

Call `rollup-babel-lib-bundler` without any arguments to see all options.

The command-line app also supports passing in options through the `package.json`. Simply create a property called `rollupBabelLibBundler`. An example configuration would look like this:
```json
"rollupBabelLibBundler": {
  "moduleName": "myFancyLibrary",
  "dest": "dist",
  "babel": {
    "presets": ["es2015-rollup", "stage-1"]
  }
}
```

It also allows passing in Babel options passed in here. This will take precedence over the `.babelrc` file. The options are passed into the `rollup-babel-plugin` where the options are slightly different from the official Babel configuration. See https://github.com/rollup/rollup-plugin-babel#configuring-babel for more details.

```
Command-line options > Package configuration options
Package babel configuration > .babelrc
```

### JavaScript API
The API is very similar to a Rollup config file. In fact, additional options will be passed into Rollup or plugins `rollup-babel-lib-bundler` uses.

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
###### Type: `String`  
###### Default: `mylibrary`
The name of the library. Will be used for the generated filenames.

#### options.moduleName
###### Type: `String`  
###### Default `myLibrary`
This is needed for the UMD build. This is the property the library will bind itself to the global object. If omitted, it will automatically use `options.name` as camel case.

#### options.dest
###### Type: `String`  
###### Default `dist`
The directory where the files will be generated to.

#### options.entry
###### Type: `String`  
###### Default `index.js`
The path to the library itself.

#### options.format
###### Type: `Array`  
###### Default `['umd', 'es6', 'cjs']`
Can be `umd`, `es6`, `cjs`, `iife` or a combination of these.

##### options.postfix
###### Type: `Object`
###### Default `{ cjs: '', es6: '.es2015', umd: '.umd', iife: '.iife' }`
Allows to define custom postfixes for each module type. `.js` will automatically be prepended.

#### options.babel
###### Type: `String` or `Object`
Allow to overwrite the babel configuration. By default its value is `inherit` and it will take the closest `.babelrc` file.

#### Return value
###### Type: `Promise`
This returns a promise with an array of objects which have the following format:

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
