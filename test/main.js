
var should = require('should'),
    crushIt = require('../lib/main');

describe('crushIt', function() {

    /*
        init is a method that initializes the app     
    */
    describe('#init', function() {
        it('should fail', function() {
            var result = crushIt.init({});
            result.should.be.false;
        });
    });
    
    
    
    
    
    
    /*
        onComplete    
    */
    describe('#onComplete', function() {
        it('should fail', function() {
            var result = crushIt.onComplete();
            result.should.be.false;
        });
    });
    
    
    
    
    
    
    /*
        parseUrl is a method that removes a trailing slash in urls     
    */
    describe('#parseUrl - with a trailing slash', function() {
        it('should return "https://github.com/qawemlilo/crushit"', function() {
            var result = crushIt.parseUrl('https://github.com/qawemlilo/crushit/');
            result.should.eql("https://github.com/qawemlilo/crushit");
        });
    });
    
    
    
    
    
    describe('#parseUrl  - without a trailing slash', function() {
        it('should return "https://github.com/qawemlilo/crushit"', function() {
            var result = crushIt.parseUrl('https://github.com/qawemlilo/crushit');
            result.should.eql("https://github.com/qawemlilo/crushit");
        });
    });
    
    
    
    
    
    
    describe('with no arguments', function() {
        it('should return "https://github.com/qawemlilo/crushit"', function() {
            var result = crushIt.parseUrl();
            result.should.be.false;
        });
    });

    
    
    
    

    /*
        #fileName is a method that takes an absolute file url and returns the file name     
    */    
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
    
    
    
    


    /*
        #getScripts is a method that takes a website address and returns an array of all scripts
    */       
    describe('#getScripts without initialising module', function() {
        it('should fail', function(done) {
            crushIt.getScripts(function (error, scripts) {
                error.should.be.true;
                scripts.should.eql([]);
                done();
            });
        });
    });
    
    
    
    
    
    
    describe('#getScript', function() {
        it('should load all scripts from http://www.rflab.co.za', function(done) {
            crushIt.init({
                website: 'http://www.rflab.co.za', 
                directory: '/'
            });
            
            crushIt.getScripts(function (error, scripts) {
                error.should.be.false;
                scripts.should.not.eql([]);
                done();
            });
        });
    });
});
