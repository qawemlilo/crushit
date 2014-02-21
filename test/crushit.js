
var should = require('should'),
    crushIt = require('../lib/crushit'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    url = require('url'),
    localhost = 'http://localhost:8070',
    instance;

describe('crushIt', function() {
    "use strict";

    var html = fs.readFileSync(path.join(__dirname, 'assets', 'html.html'));
    var script = fs.readFileSync(path.join(__dirname, 'assets', 'script.js'));
    
    crushIt = new crushIt();
    
    // create a server
    before(function(done) {
        instance = http.createServer(function(req, res) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            
            var route = path.basename(req.url);

            if (route == 'script.js') {
                res.end(script);
            }
            else {
                res.end(html);
            }
            
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
    
    
    describe('#loadWebPage', function() {
        it('should load all scripts from ' + localhost, function(done) {
            crushIt.loadWebPage(localhost, function (error, scripts) {
                error.should.be.false;
                scripts.length.should.be.above(0);
                done();
            });
        });
    });
    
    
    describe('#loadScript', function() {
        it('should load a script from a url ', function(done) {
            crushIt.loadScript('/script.js', localhost, function (error, script) {
                error.should.be.false;
                done();
            });
        });
    });
    
    
    describe('#squeeze', function() {
        it('should load a web page and crush all scripts, first argument as object', function(done) {
            crushIt.squeeze({
                website: localhost,
                max: true,
                comments: false,
                mangle: true,
                beautify: false
            }, 
            function (error, code) {
                error.should.be.false;
                code.length.should.be.above(0);
                done();
            });   
        });
    });
    
    
    describe('#squeeze', function() {
        it('should load a web page and crush all scripts, first argument as string ', function(done) {
            crushIt.squeeze(localhost, function (error, code) {
                error.should.be.false;
                code.length.should.be.above(0);
                done();
            });   
        });
    });
});
