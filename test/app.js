
var should = require('should'),
    CrushIt = require('../index');

describe('CrushIt', function() {

    describe('#crushScripts with options specified', function() {
        it('should load all scripts from http://www.google.com and call my custom onComplete method', function(done) {
            CrushIt.crushScripts('http://www.google.com', {
                beautify: false, 
                
                strict: false, 
                
                onComplete: function(code) {
                    if (code) {
                        console.log('Success! Custon onComplete method called!'); 
                    }
                    else {
                        console.log('Error!! Custon onComplete method called!');
                    }
                    done();
                }
            });
        });
    });
    
    
    describe('#crushScripts without options specified', function() {
        it('should load all scripts from http://www.rflab.co.za', function(done) {
            CrushIt.crushScripts('http://www.rflab.co.za');
            done();
        });
    });

});
