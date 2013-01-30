
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
        #getFileName is a method that takes an absolute file url and returns the file name     
    */    
    describe('#getFileName without arguments', function() {
        it('should return false', function() {
            var result = crushIt.getFileName();
            result.should.be.false;
        });
    });
    
    
    
    
    
    describe('#getFileName with absolute url', function() {
        it('should return file name', function() {
            var result = crushIt.getFileName('http://localhost:3003/script.js');
            result.should.eql('script.js');
        });
    });
    
    
    
    
    
    
    describe('#getFileName with file name', function() {
        it('should return file name', function() {
            var result = crushIt.getFileName('script.js');
            result.should.eql('script.js');
        });
    });
    
    
    describe('#getFileName with leading slash', function() {
        it('should return file name', function() {
            var result = crushIt.getFileName('/script.js');
            result.should.eql('script.js');
        });
    });
    
    
    
    


    /*
        #loadWebPage is a method that takes a website address and returns an array of all scripts
    */       
    describe('#loadWebPage without initialising module', function() {
        it('should fail', function(done) {
            crushIt.loadWebPage(function (error) {
                error.should.be.true;
                done();
            });
        });
    });
    
    
    
    
    
    
    describe('#loadWebPage', function() {
        it('should load all scripts from http://www.apple.com', function(done) {
            crushIt.init({
                website: 'http://www.apple.com', 
                directory: '/', 
                parserOptions: {
                    strict: false
                },
                
                beautify: false
            });
            
            crushIt.loadWebPage(function (fn) {
                done();
            });
        });
    });
    
    
    
    describe('#processOptions', function() {
        it('should copy properties of object ', function() {
            crushIt.processOptions({
                website: 'http://www.rflab.co.za', 
                directory: '/', 
                parserOptions: {
                    strict: false
                },
                
                beautify: false
            });
            
            crushIt.website.should.eql('http://www.rflab.co.za');
            crushIt.directory.should.eql('/');
            crushIt.beautify.should.be.false;
            crushIt.parserOptions.strict.should.be.false;
        });
    });
    
    
    
    
    describe('#echoMsg', function() {
        it('should echo "Hello Nodesters!!" ', function() {
            crushIt.echoMsg('Hello Nodesters!!');
        });
    });
});
