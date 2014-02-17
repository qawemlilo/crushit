
var should = require('should'),
    CrushIt = require('../index'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    localhost = 'http://localhost:8071',
    instance;

describe('CrushIt', function() {
    var html = fs.readFileSync(path.join(__dirname, 'html.html'));
    
    // create a server
    before(function(done) {
        instance = http.createServer(function(req, res) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            })
            res.end(html);
        }).listen(8071);
        instance.on("listening", function() {
            console.log("testing server 2 is up");
            done();
        });
    });
    
    after(function(done){
      instance.close();
      console.log("testing 2 server stopped");
      done();
    });
    
    describe('#crushScripts with options specified', function() {
        it('should load all scripts from ' + localhost + ' and call my custom onComplete method', function(done) {
            CrushIt.crushScripts(localhost, {
                beautify: false,
                
                comments: false,
                
                max: false, 
                
                onComplete: function(error, code) {
                    error.should.be.false;
                    done();
                }
            });
        });
    });

});
