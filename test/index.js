var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var expect = chai.expect;
var rollupBabelLibBundler = require('../lib');

describe('rollup-babel-lib-bundler', function() {
  it('is a function', function() {
    expect(rollupBabelLibBundler).to.be.a('function');
  });

  it('returns a promise', function(done) {
    var promise = rollupBabelLibBundler();

    // On Node 0.10, promise is shimmed
    if (typeof promise !== 'object') {
      expect(promise).to.be.a('Promise');
    }

    expect(promise).to.eventually.be.rejected.and.notify(done);
  });

  it('creates new files', function(done) {
    var promise = rollupBabelLibBundler({
      entry: 'test/sample.js',
    });

    expect(promise).to.eventually.be.a('array').and.notify(done);
  });

  it('adds the proper postfix', function(done) {
    var expected = ['dist/mylibrary.common.js', 'dist/mylibrary.es2015.js'];
    var promise = rollupBabelLibBundler({
      entry: 'test/sample.js',
      format: ['cjs', 'es6'],
      postfix: {
        cjs: '.common',
      }
    }).then(function (results) {
      return results.map(function(file) {
        return file.path;
      });
    });

    expect(promise).to.eventually.be.eql(expected).and.notify(done);
  });
});
