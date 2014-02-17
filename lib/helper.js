
/*
    Globals
*/

var url = require('url'), 
    Helper = {},
    urlBase,
    urlPath,
    parseUrl,
    resolveUrl,
    _extend,
    echoMsg,
    getFileName;



/*
    Private functions
*/

_extend = function (obj) {
    [].call(arguments, 1).forEach(function(source) {
        if (source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    });
    
    return obj;
};

/*
    Extracts the base from a url
    
    @api:     private
    @param:   (String) urlStr - a url 
    @returns: url base   
*/
urlBase = function (urlStr) {
    var urlObject = url.parse(urlStr), base; 
        
    base = parseUrl(urlObject.protocol + '//' + urlObject.hostname);
        
    return base;
};




/*
    Extracts a pathname from a url
    
    @api:     private
    @param:   (String) urlStr - a url 
    @returns: url pathname   
*/
urlPath = function (urlStr) {
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
    if (!urlStr) {
        return false;
    }
    
    if (urlStr.indexOf('demo') >= 0) {
      urlStr = urlStr.replace('demo', '');
    }
        
    var lastCharIndex = (urlStr.length - 1),
        lastChar = urlStr[lastCharIndex];
            
    if (lastChar === '/') {
        urlStr = urlStr.substring(0, lastCharIndex); 
    }
        
    return urlStr; 
};
    
    
    

/*
    logs message on terminal
    @api: private
*/    
echoMsg = function(msg) {
    console.log('========================================================\n' + msg + '\n========================================================');   
};
    



/*
    Remove trailing slash from a url
    
    @api:     public
    @param:   (String) urlStr - a filename / part of a url / url
    @param:   (String) website - a url
    @param:   (Boolean) flag - a flag to determine if Base or pathname should be used
    @returns: a complete url   
*/
resolveUrl = function (urlStr, website, flag) {
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
    Extracts a file name from a url
    
    @api:     public
    @param:   (String) urlStr - a url 
    @returns: a file name   
*/
getFileName = function (urlStr) {
    if (!urlStr) {
        return false;
    }
        
    if (urlStr.indexOf('/') < 0) {
        return urlStr;
    }
        
    var start = urlStr.lastIndexOf('/');
            
    return urlStr.substring(start + 1); 
};



/*
    Export Object
*/
  
Helper._extend = _extend;  
Helper.resolveUrl = resolveUrl;
Helper.getFileName = getFileName;
Helper.parseUrl = parseUrl;
Helper.echoMsg = echoMsg;

module.exports = Helper;
