
/*
    Dependencies
*/

"use strict";

var request = require('request'),
    cheerio = require('cheerio'),
    uglify = require('uglify-js'),
    fs = require('fs'),
    crushIt;
    
    
    
crushIt = Object.create({

    website: '',
    
    scripts: [],    
    
    encoding: 'utf8',    
    
    filename: '',
    
    minify: false,
    
    stream: null,
    
    parserOptions: {},
    

    

    /*
        Initializes Crushit
        @api: public
    */     
    init: function (opts) {
        var self = this, website = self.parseUrl(opts.website);
        
        if (!website || !opts.directory) {
            return false;
        }
        
        self.processOptions(opts);       
        self.stream = uglify.OutputStream({beautify: opts.beautify});       
        self.filename = opts.directory + '/script_' + (new Date().getTime()) + '.js';
       
        self.loadWebPage(function (err) {
            if (err) {
                self.echoMsg(' Error, could not read scripts from ' + self.website);               
            }
            else {
              self.loadScripts();
            }
        });
    },
       
    
    
    
    onComplete: function () {
        var self = this, code = self.stream.toString();
        
        if (code) {
            fs.writeFile(self.filename, code, self.encoding, function () {
                self.echoMsg('Success!! Scripts compiled and saved in ' + self.getFileName(self.filename));
            });
        }
        else {
            self.echoMsg(' Error, compilation failed!');
            
            return false;
        }
    },
    
    
    
        
    parseUrl: function (url) {
        if (!url) {
            return false;
        }
        
        if (url.indexOf('demo') >= 0) {
            url = url.replace('demo', '');
        }
        
        var lastCharIndex = (url.length - 1),
            lastChar = url[lastCharIndex];
            
        if (lastChar === '/') {
            url = url.substring(0, lastCharIndex); 
        }
        
        return url; 
    },
        
    
    
        
    getFileName: function (url) {
        if (!url) {
            return false;
        }
        
        if (url.indexOf('/') < 0) {
            return url;
        }
        
        var start = url.lastIndexOf('/');
            
        return url.substring(start + 1); 
    },
    
    
    

    /*
        Loads a web page and reads its scripts
        @api: private
    */     
    loadWebPage: function (fn) {

        var i = 0, self = this;
        
        //Reset 
        if (self.scripts.length > 0) {
            self.scripts = [];   
        }
        
        request(self.website, function (err, response, body) {
        
            if (!err && response.statusCode === 200) {
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
                        
                        console.log(' found script(' + i + ') - ' + self.getFileName(src));
                    } 
                    else {
                        self.scripts.push({type: 'inline', data: $(this).text()});
                        console.log(' found inline script');
                    }
                });
            
                fn(false);
            }
            else {
                fn(true);
            }
        
        
        });    
    },
    
        
       

    /*
        A recursive method that loads scripts from this.scripts
        @api: private
    */       
    loadScripts: function () {
        var self = this, ast, script;

        // let us check if we have any scripts in our scripts array
        if (!self.scripts.length > 0) {
            return self.onComplete(); // we dont, we are done
        }
        
        script = self.scripts.shift(); // we do, grab first in line
        
        // inline script
        if (script.type === 'inline') {
            ast = uglify.parse(script.data, self.parserOptions); // parse the javascript
            ast.print(self.stream);  // write it to our stream
            
            self.loadScripts();
        }
        
        // script in a file
        else if (script.type === 'absolute') {
            self.loadScript(script.data, function (error, js) {
                if (!error) {
                    ast = uglify.parse(js, self.parserOptions); // parse the javascript
                    ast.print(self.stream); // write it to our stream
                
                    self.loadScripts();
                }
                else {
                    console.log('Error!! Failed to load ' + script.data);               
                }
            });
        }
        
        // unknown script type
        else {
            console.log('Script type error');
        }        
    },
     
    
    

    /*
        Loads a script from a url
        @api: private
    */    
    loadScript: function (url, fn) {
        var self = this, ast;
        
        request(url, function (error, response, script) {
            if (!error && response.statusCode === 200) {
                fn(false, script);          
            }
            else {
                fn(true, '');
            }
        });
    },
    
    
    
       
    /*
        Processes commandline options
        @api: private
    */
    processOptions: function(opts) {
        var self = this, opt;
        
        for (opt in opts) {
            if (opts.hasOwnProperty(opt)) {
                self[opt] = opts[opt];    
            }
        }
    },
    
    
    

    /*
        logs message on terminal
        @api: private
    */    
    echoMsg: function(msg) {
        console.log('=======================================================================');
        console.log(msg);
        console.log('=======================================================================');    
    }
});

module.exports = crushIt;
