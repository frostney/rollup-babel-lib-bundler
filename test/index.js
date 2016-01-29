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

    expect(promise).to.be.a('Promise');
    expect(promise).to.eventually.be.rejected.and.notify(done);
  });

  it('creates new files', function(done) {
    var promise = rollupBabelLibBundler({
      entry: 'test/sample.js',
    });

    expect(promise).to.eventually.be.a('array').and.notify(done);
  });
});
