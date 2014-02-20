
/*
    Globals
*/

var url = require('url'), urlBase, urlPath, parseUrl, resolveUrl, echoMsg;


/*
    Extracts the base from a url
    
    @api:     private
    @param:   (String) urlStr - a url 
    @returns: url base   
*/
urlBase = function (urlStr) {
    "use strict";
    
    var urlObject = url.parse(urlStr), base; 
        
    base = parseUrl(urlObject.protocol + '//' + urlObject.host);
        
    return base;
};




/*
    Extracts a pathname from a url
    
    @api:     private
    @param:   (String) urlStr - a url 
    @returns: url pathname   
*/
urlPath = function (urlStr) {
    "use strict";
    
    var urlObject = url.parse(urlStr), pathname;
    
    pathname = urlObject.pathname;
    
    if (pathname.indexOf('.htm') > 0 || pathname.indexOf('.html') > 0 || pathname.indexOf('.shtml') > 0 || pathname.indexOf('.jsp') > 0 || pathname.indexOf('.asp') > 0 || pathname.indexOf('.cgi') > 0 || pathname.indexOf('.php') > 0 || pathname.indexOf('.pl') > 0 )
    {
        pathname = pathname.substring(0, pathname.lastIndexOf('/'));
    }
    
    return parseUrl(pathname);
};




/*
    Remove trailing slash from a url
    
    @api:     private
    @param:   (String) urlStr - a url 
    @returns: url without trailing slash   
*/
parseUrl = function (urlStr) {
    "use strict";
    
    if (!urlStr) {
        return false;
    }
        
    var lastCharIndex = (urlStr.length - 1), lastChar = urlStr[lastCharIndex];
            
    if (lastChar === '/') {
        urlStr = urlStr.substring(0, lastCharIndex); 
    }
        
    return urlStr; 
};
    



/*
    Resolve url base
    
    @api:     public
    @param:   (String) urlStr - a filename / part of a url / url
    @param:   (String) website - a url
    @param:   (Boolean) flag - a flag to determine if Base or pathname should be used
    @returns: a complete url   
*/
resolveUrl = function (urlStr, website, flag) {
    "use strict";
    
    if (urlStr.indexOf('http://') >= 0 || urlStr.indexOf('https://') >= 0) {
        return urlStr;
    }
        
    if (urlStr.indexOf('//') === 0) {
        return 'http:' + urlStr;
    }
        
    if (urlStr[0] !== '/') {
        urlStr = '/' + urlStr;
    }
        
    var base = urlBase(website), pathname = urlPath(website), resolvedUrl;
        
    if (flag) {
        resolvedUrl = base + urlStr;
    }
    else {
        resolvedUrl = base + pathname + urlStr;
    }
        
    return resolvedUrl;
};



/*
    Export Object
*/
 
module.exports.resolveUrl = resolveUrl;
module.exports.urlPath = urlPath;
module.exports.urlBase = urlBase;
module.exports.parseUrl = parseUrl;

