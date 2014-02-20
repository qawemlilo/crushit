
var should = require('should'),
    helper = require('../lib/helper');


describe('#urlBase', function() {
    it('should extracts a pathname from a url', function() {
        var base = helper.urlBase('http://www.sanatural.co.za/home/index.php?option=com_map&Itemid=270'); 
        
        base.should.be.eql('http://www.sanatural.co.za');
    });
});


describe('#parseUrl', function() {
    it('should remove trailing slash from a url', function() {
        var url = helper.parseUrl('http://www.ragingflame.co.za/'); 
        
        url.should.be.eql('http://www.ragingflame.co.za');
    });
});


describe('#resolveUrl', function() {
    it('should resolve url base with or without path', function() {
    
        var urlWithoutPath = helper.resolveUrl('/js/script-min.js', 'http://blog.ragingflame.co.za/2013/6/8/the-state-of-node', true);
        var urlWithPath = helper.resolveUrl('/js/script-min.js', 'http://www.sanatural.co.za/home/index.php?option=com_map&Itemid=270');
        
        urlWithoutPath.should.be.eql('http://blog.ragingflame.co.za/js/script-min.js');
        urlWithPath.should.be.eql('http://www.sanatural.co.za/home/js/script-min.js');
    });
});


describe('#urlPath', function() {
    it('should extracts a pathname from a url', function() {
        var path = helper.urlPath('http://www.sanatural.co.za/home/index.php?option=com_map&Itemid=270'); 
        
        path.should.be.eql('/home');
    });
});
