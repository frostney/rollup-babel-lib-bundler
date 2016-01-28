# rollup-babel-lib-bundler
Utility to bundle JavaScript libraries with Rollup

## Installation
```
$ npm install rollup-babel-lib-bundler
```

## Usage

### Command-line
```
rollup-babel-lib-bundler ./myFancyLibrary.js
```

### Programmatic usage
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
Type `String`  
The name of the library. Will be used for the generated filenames.

#### options.moduleName
Type `String`  
This is needed for the UMD build. This is the property the library will bind itself to the global object. If omitted, it will automatically use `options.name` as camel case.

#### options.dest
Type `String`  
The directory where the files will be generated to.

#### options.entry
Type `String`  
The path to the library itself.

#### options.format
Type: `Array`  
Can be `umd`, `es6` or `cjs` or a combination of these.

## License
MIT
