
var should = require('should'),
    crushIt = require('../lib/main'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    localhost = 'http://localhost:8070',
    instance;

describe('crushIt', function() {
    "use strict";
    var html = fs.readFileSync(path.join(__dirname, 'html.html'));
    
    // create a server
    before(function(done) {
        instance = http.createServer(function(req, res) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            })
            res.end(html);
        }).listen(8070);
        instance.on("listening", function() {
            console.log("testing server is up");
            done();
        });
    });
    
    after(function(done){
      instance.close();
      console.log("testing server stopped");
      done();
    });
    
    /*
        init is a method that initializes the app     
    */
    describe('#init', function() {
        it('should fail', function() {
            var result = crushIt.init({});
            result.should.be.false;
        });
    });
    
    
    describe('#loadWebPage', function() {
        it('should load all scripts from ' + localhost, function(done) {
            crushIt.init({
                website: localhost, 
                directory: __dirname,
                comments: false,
                beautify: false
            });
            
            crushIt.loadWebPage(localhost, function (error, scripts) {
                error.should.be.false;
                scripts.length.should.be.above(0);
                done();
            });
        });
    });
    
    
    describe('#processOptions', function() {
        it('should copy properties of object ', function() {
            crushIt.processOptions({
                website: localhost, 
                directory: '/', 
                comments: false,
                beautify: false
            });
            
            crushIt.website.should.eql(localhost);
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
