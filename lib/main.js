#!/usr/bin/env node

/*
    Dependencies
*/
var request = require('request'),
    cheerio = require('cheerio'),
    uglify = require('yuglify'),
    fs = require('fs');
    
    
    
var crushIt = {

    website: '',
    
    
    scripts: [],
    
    
    raw: '',
    
    
    encoding: 'utf8',
    
    
    production: '',
    
    
    development: '',
    
    
    init: function (url, workingDir) {
        var self = this;
       
        self.website = self.parseUrl(url);
        self.development = workingDir + '/script_' + (new Date().getTime()) + '.js';
        self.production = workingDir + '/script-min_' + (new Date().getTime()) + '.js';
       
        self.getScripts(function () {
            var script = self.scripts.shift();
            
            console.log('==========================================================');
            console.log('  Loading scripts, compilling and and compressing');
            console.log('==========================================================');
            self.loadScripts(script);
        });
    },
    
    
    onComplete: function () {
        var self = this;
        
        if (self.raw) {
            fs.writeFile(self.development, self.raw, self.encoding, function () {
                console.log('==========================================================');
                console.log('Success!! Scripts(uncompressed) saved in ' + self.development);
                console.log('==========================================================');
            });
            
            uglify.jsmin(self.raw, function (err, smashed) {
                if (err) {
                    console.log('Compressing scripts failed');
                }
                else {
                    fs.writeFile(self.production, smashed, self.encoding, function () {
                        console.log('Success!! Scripts compressed and saved in ' + self.development);
                        console.log('==========================================================');
                    });
                }
            });
        }
        else {
            console.log('No scripts found');
        }
    },
    
    
    parseUrl: function (url) {
        if (!url) {
            return false;
        }
        
        var lastCharIndex = (url.length - 1),
            lastChar = url[lastCharIndex];
            
        if (lastChar === '/') {
            url = url.substring(0, lastCharIndex); 
        }
        
        return url; 
    },
    
    
    fileName: function (url) {
        if (!url) {
            return false;
        }
        
        if (url.indexOf('/') < 0) {
            return url;
        }
        
        var start = url.lastIndexOf('/');
            
        return url.substring(start + 1); 
    },
    
    
    getScripts: function (fn) {

        var error = false, i = 0, self = this;
        
        if (self.scripts.length > 0) {
            self.scripts = [];   
        }
        
        request(self.website, function (err, response, body) {
        
            if (!err && response.statusCode == 200) {
                var $ = cheerio.load(body);
            
                $('script').each(function () {
                    var src = $(this).attr('src');
                
                    if (src) {
                        if (src.indexOf('http://') < 0 && src.indexOf('https://') < 0) {
                            if (src[0] !== '/') {
                                src = '/' + src;
                            }
                            if (src.indexOf('//') === 0) {
                                src = 'http:' + src;
                            }
                            else {
                                src =  self.website + src;
                            }                                
                        }
                        
                        self.scripts.push(src);
                        i++;
                        console.log(' found script ' + i + ' - ' + self.fileName(src));
                    } 
                    else {
                        self.scripts.push($(this).text());
                        console.log(' found inline script');
                    }
                });
            
                fn(false, self.scripts);
            }
            else {
                fn(true, self.scripts);
            }
        
        
        });    
    },
    
    
    loadScripts: function (script) {
        var self = this;
        
        if (script.indexOf('http://') < 0 && script.indexOf('https://') < 0) {
        
            self.raw += script;
            
            console.log('inline script compiled.');
        
            if (self.scripts.length > 0) {
                self.loadScripts(self.scripts.shift());
            }
            else {
                self.onComplete();
            }
        }
        else {
            self.loadScript(script); 
        }    
    },
    
    
    loadScript: function (url) {
        var self = this;
        
        request(url, function (error, response, script) {
            if (!error && response.statusCode == 200) {
                self.raw += script;
            
                console.log(' '+ url +' loaded and compiled.');
            
                if (self.scripts.length > 0) {
                    self.loadScripts(self.scripts.shift());
                }
                else {
                   self.onComplete();
                }              
            }
            else {
                console.log('Error!! Failed to load ' + url);
                new Error('Failed to load ' + url);
            }
        });
    }
};

module.exports = crushIt;
