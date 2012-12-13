
var should = require('should');
var parse = require('../lib/main');

describe('parse', function() {
    describe('with no arguments', function() {
        it('should return "no url"', function() {
            var result = parse();
            result.should.eql("no url");
        });
    });
});
