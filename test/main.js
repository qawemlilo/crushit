
var should = require('should');
var crushIt = require('../lib/main');

describe('crushIt', function() {
    describe('#parseUrl', function() {
        it('should return "https://github.com/qawemlilo/crushit"', function() {
            var result = crushIt.parseUrl('https://github.com/qawemlilo/crushit/');
            result.should.eql("https://github.com/qawemlilo/crushit");
        });
    });
    
    describe('with url https://github.com/qawemlilo/crushit', function() {
        it('should return "https://github.com/qawemlilo/crushit"', function() {
            var result = crushIt.parseUrl('https://github.com/qawemlilo/crushit');
            result.should.eql("https://github.com/qawemlilo/crushit");
        });
    });
    
    
    describe('with no url', function() {
        it('should return "https://github.com/qawemlilo/crushit"', function() {
            var result = crushIt.parseUrl();
            result.should.be.false;
        });
    });

    
    describe('#fileName without arguments', function() {
        it('should return false', function() {
            var result = crushIt.fileName();
            result.should.be.false;
        });
    });
    
    describe('#fileName with absolute url', function() {
        it('should return file name', function() {
            var result = crushIt.fileName('http://localhost:3003/script.js');
            result.should.eql('script.js');
        });
    });
    
    
    describe('#fileName with file name', function() {
        it('should return file name', function() {
            var result = crushIt.fileName('script.js');
            result.should.eql('script.js');
        });
    });
    
    
    describe('#fileName with leading slash', function() {
        it('should return file name', function() {
            var result = crushIt.fileName('/script.js');
            result.should.eql('script.js');
        });
    });

    
    describe('#getScripts without initialising module', function() {
        it('should fail', function(done) {
            crushIt.getScripts(function (error, scripts) {
                error.should.be.true;
                scripts.should.eql([]);
                done();
            });
        });
    });
    
    describe('#getScripts lets load a local website http://anders.janmyr.com/2012/04/writing-node-module.html', function() {
        it('should laod all scripts ', function(done) {
            crushIt.init('http://anders.janmyr.com/2012/04/writing-node-module.html');
            crushIt.getScripts(function (error, scripts) {
                error.should.be.false;
                scripts.should.not.eql([]);
                done();
            });
        });
    });
});
