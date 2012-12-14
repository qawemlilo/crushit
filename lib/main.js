
/*
    Dependencies
*/

var request = require('request'),
    cheerio = require('cheerio'),
    uglify = require('yuglify'),
    fs = require('fs'),
    crushIt;
    
    
    
crushIt = Object.create({

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
            console.log('  Loading, compiling and compressing scripts');
            console.log('==========================================================');
            self.loadScripts(script);
        });
    },
    
    
    
    
    
    onComplete: function () {
        var self = this;
        
        if (self.raw) {
            fs.writeFile(self.development, self.raw, self.encoding, function () {
                console.log('==========================================================');
                console.log('Success!! Scripts(uncompressed) saved in ' + self.fileName(self.development));
                console.log('==========================================================');
            });
            
            uglify.jsmin(self.raw, function (err, smashed) {
                if (err) {
                    console.log('Compressing scripts failed');
                }
                else {
                    fs.writeFile(self.production, smashed, self.encoding, function () {
                        console.log('==========================================================');
                        console.log('Success!! Scripts(compressed) saved in ' + self.fileName(self.development));
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
                        
                        self.scripts.push({type: 'absolute', data: src});
                        i++;
                        console.log(' found script ' + i + ' - ' + self.fileName(src));
                    } 
                    else {
                        self.scripts.push({type: 'inline', data: $(this).text()});
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
        
        
        /*
            If protocol is not founnd then it is an inline script
        */
        if (script.type === 'inline') {
        
            self.raw += script.data;
            
            console.log(' - inline script compiled.');
            
            /*
                If we still have uncompiled scripts
                let us take the next one in the queue
            */                
            if (self.scripts.length > 0) {
                self.loadScripts(self.scripts.shift());
            }
            
            
            /*
               Otherwise we are done
            */
            else {
                self.onComplete();
            }
        }
        else if (script.type === 'absolute') {
            if (script.data.indexOf('modernizr') >= 0) {
                console.log('Modernizr found');
            }
            self.loadScript(script.data); 
        }    
    },
    
    
    loadScript: function (url) {
        var self = this;
        
        request(url, function (error, response, script) {
            if (!error && response.statusCode == 200) {
                self.raw += script;
            
                console.log(' - '+ self.fileName(url) +' loaded and compiled.');

                /*
                    If we still have uncompiled scripts
                    let us take the next one in the queue
                    and pass it to loadScripts method
                */                
                if (self.scripts.length > 0) {
                    self.loadScripts(self.scripts.shift());
                }
                
                
                /*
                    Otherwise we are done
                */
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
});

module.exports = crushIt;
