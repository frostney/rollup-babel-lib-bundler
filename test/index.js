var chai = require('chai');
var expect = chai.expect;
var rollupBabelLibBundler = require('../lib');

describe('rollup-babel-lib-bundler', function() {
  it('is a function', function() {
    expect(rollupBabelLibBundler).to.be.a('function');
  });
});
