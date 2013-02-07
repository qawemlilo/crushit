
var should = require('should'),
    crushIt = require('../lib/main');

describe('crushIt', function() {
    "use strict";
    
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
                comments: false,
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
                comments: false,
                beautify: false
            });
            
            crushIt.website.should.eql('http://www.rflab.co.za');
            crushIt.directory.should.eql('/');
            crushIt.beautify.should.be.false;
            crushIt.comments.should.be.false;
        });
    });
    
    
    
    
    describe('#echoMsg', function() {
        it('should echo "Hello Nodesters!!" ', function() {
            crushIt.echoMsg('Hello Nodesters!!');
        });
    });
});
