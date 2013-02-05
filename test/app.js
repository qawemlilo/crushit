
var should = require('should'),
    CrushIt = require('../index');

describe('CrushIt', function() {

    describe('#crushScripts with options specified', function() {
        it('should load all scripts from http://www.google.com and call my custom onComplete method', function(done) {
            CrushIt.crushScripts('http://www.google.com', {
                beautify: false,
                
                comments: false,
                
                strict: false, 
                
                onComplete: function(error, code) {
                    var logs;
                    
                    if (error) {
                        console.log(error.msg); 
                    }
                    else {
                        console.log('Success! Custon onComplete method called!');
                        CrushIt.getLogs().should.not.be.empty;
                    }
                    done();
                }
            });
        });
    });
    
    
    describe('#crushScripts without options specified', function() {
        it('should load all scripts from http://www.rflab.co.za', function(done) {
            var result = CrushIt.crushScripts('http://www.rflab.co.za');
            
            result.should.be.false;
            
            done();
        });
    });

});
