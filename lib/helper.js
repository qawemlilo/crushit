
/*
    Globals
*/

var url = require('url'),  
    path = require('path');


/*
    Extracts the base from a url
    
    @api:     private
    @param:   (String) urlStr - a url 
    @returns: url base   
*/
function urlBase(urlStr) {
    "use strict";
    
    var urlObject = url.parse(urlStr, true), base; 
        
    base = parseUrl(urlObject.protocol + '//' + urlObject.host);
        
    return base;
}



/*
    Extracts the base from a url
    
    @api:     private
    @param:   (String) urlStr - a url 
    @returns: url base   
*/
function isHttps(urlStr) {
    "use strict";
    
    var protocol = url.parse(urlStr, true).protocol;
        
    return (protocol === 'https:');
}




/*
    Extracts a pathname from a url
    
    @api:     private
    @param:   (String) urlStr - a url 
    @returns: url pathname   
*/
function urlPath(urlStr) {
    "use strict";
    
    var urlObject = url.parse(urlStr, true), pathname, ext;
    
    pathname = urlObject.pathname;
    ext = path.extname(pathname);
    
    switch (ext) {
        case '.htm':
        case '.html':
        case '.shtml':
        case '.asp':
        case '.cgi':
        case '.pl':
        case '.php':
            pathname = pathname.substring(0, pathname.lastIndexOf('/'));
        break;
    }
    
    return parseUrl(pathname);
}




/*
    Remove trailing slash from a url
    
    @api:     private
    @param:   (String) urlStr - a url 
    @returns: url without trailing slash   
*/
function parseUrl(urlStr) {
    "use strict";
    
    if (!urlStr) {
        return false;
    }
        
    var lastCharIndex = (urlStr.length - 1), lastChar = urlStr[lastCharIndex];
            
    if (lastChar === '/') {
        urlStr = urlStr.substring(0, lastCharIndex); 
    }
        
    return urlStr; 
}
    



/*
    Resolve url base
    
    @api:     public
    @param:   (String) urlStr - a filename / part of a url / url
    @param:   (String) website - a url
    @param:   (Boolean) flag - a flag to determine if Base or pathname should be used
    @returns: a complete url   
*/
function resolveUrl(urlStr, website, flag) {
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
}



/*
    Export Object
*/
 
module.exports.resolveUrl = resolveUrl;
module.exports.urlPath = urlPath;
module.exports.urlBase = urlBase;
module.exports.parseUrl = parseUrl;
module.exports.isHttps = isHttps;

