﻿
/*
    Dependencies
*/

var http = require('http'),
    https = require('https'),
    cheerio = require('cheerio'),
    uglify = require('uglify-js'),
    helper = require('./helper'),
    path = require('path'),
    chalk = require('chalk'),
    CrushIt;


CrushIt = function () {
    "use strict";
    
    this.website = '';
    this.scripts = [];
    this.directory = '';
    this.minify = false;
    this.stream = null;
    this.externalScripts = false;
    this.options = {};
};
  
    
CrushIt.prototype = {

    /*
        Initializes CrushIt
        @api: public
    */     
    squeeze: function (opts, callback) {
        "use strict";
        
        var self = this, website, options;
        
        if (typeof opts === 'string') {
            website = helper.parseUrl(opts);
            options = {};  
        }
        else if (typeof opts === 'object') {
            website = helper.parseUrl(opts.website);
            options = opts;              
        }
        
        if (!website || typeof callback !== 'function') {
           self.echoMsg('unknown arguments, please check documentation', 'error');
           return false;
        }
        
        self.options = options;
        self.callback = callback;
        self.website = website;
        
        self.stream = uglify.OutputStream({
            beautify: opts.beautify,
            comments: opts.comments
        });
       
        self.loadWebPage(website, function (err, scripts) {
            if (err) {
                callback(err, '');            
            }
            else {
                self.scripts = scripts;
                
                if (self.externalScripts) {
                    self.echoMsg('Preparing to download external scripts....', 'info');
                }
                self.loadScripts();
            }
        });
        
        return self;
    },
    

    /*
        Loads a web page and reads its scripts
        @api: private
    */     
    loadWebPage: function (website, fn) {
        "use strict";

        var self = this,
            scripts = [],        
            num_external = 0, 
            num_inline=0, 
            src,
            request = http;
            
        
        if (helper.isHttps(website)) {
            request = https;
        }
        
        request.get(website, function (res) {
            var body = '';
            
            res.on('data', function (chunk) {
                body += chunk;
            });
            
            res.on('end', function () {
                var $ = cheerio.load(body);
            
                $('script').each(function () {
                    src = $(this).attr('src');
            
                    if (src) {
                        self.externalScripts = true;
                        
                        scripts.push({type: 'absolute', data: src});
                        num_external++;
                        self.echoMsg('found external script(' + num_external + ') ' + chalk.yellow(path.basename(src)), 'info');
                    } 
                    else {
                        var inline = $(this).text();
                        
                        inline = inline.replace(/<!--[\s\S]*?-->/g, "");
                        scripts.push({type: 'inline', data: inline});
                        num_inline++;
                        self.echoMsg('found inline script(' + num_inline + ')', 'info');
                    }
                });
            
                fn(false, scripts);
            });
        })
        .on('error', function (err) {
            fn(err);
        });        
    },
    

    /*
        Loads a script from a url
        @api: private
    */    
    loadScript: function (urlStr, website, fn, flag) {
        "use strict";
        
        var self = this, parsedUrl, request = http; 
        
        parsedUrl = helper.resolveUrl(urlStr, website, flag);
        
        self.echoMsg('downloading ' + chalk.yellow(parsedUrl), 'info');
            
        
        if (helper.isHttps(parsedUrl)) {
            request = https;
        }
        
        request.get(parsedUrl, function (res) {
            var script = '';
            
            res.on('data', function (chunk) {
                script += chunk;
            });
            
            res.on('end', function () {
                if (flag) {
                    self.echoMsg('loaded url without pathname: ' + chalk.yellow(parsedUrl), 'success');
                }
                else {
                    self.echoMsg('download complete: ' + chalk.yellow(path.basename(parsedUrl)), 'success');
                }
                
                fn(false, script); 
            });
        })
        .on('error', function (error) {
            // Try again using base url without pathname
            if (!flag) {
                self.echoMsg('failed to load ' + chalk.yellow(parsedUrl) + '\n Try again using base url without pathname', 'error');
                self.loadScript(urlStr, website, fn, true);
            }
            else {
                self.echoMsg('failed to load ' + chalk.yellow(parsedUrl), 'error');
                fn(error, '');
            }        
        });
    },
        
       
    /*
        A recursive method that loads scripts from this.scripts
        @api: private
    */       
    loadScripts: function () {
        "use strict";
        
        var self = this, ast, script, code;

        // let us check if we have any scripts in our scripts array
        if (!self.scripts.length) {
            code = self.stream.toString();
            
            if (self.options.max) {
                code = self.maxCompression(code);
            }
            
            return self.callback(false, code); 
        }
        
        // we do, grab first in line
        script = self.scripts.shift(); 
        
        // inline script
        if (script.type === 'inline') {
            
            // parse the javascript
            ast = uglify.parse(script.data, {strict: self.options.strict});
            
             // write it to our stream
            ast.print(self.stream); 
            
            self.loadScripts();
        }
        
        // script in a file
        else if (script.type === 'absolute') {
            self.loadScript(script.data, self.website, function (error, js) {
                if (!error) {
                    ast = uglify.parse(js);
                    ast.print(self.stream); 
                
                    self.loadScripts();
                }
                else {
                    self.callback(error, '');               
                }
            });
        }
        else {
            self.callback(new Error('unknown script type'), '');
        }        
    },
    
    
    /*
        Performs maximun compression
        
        @param: code (String)
    */
    maxCompression: function (code) {
        "use strict";
        
        var ast = uglify.parse(code), compressor; 
        
        ast.figure_out_scope();
        compressor = uglify.Compressor();
        ast = ast.transform(compressor);
    
        ast.figure_out_scope();
        ast.compute_char_frequency();
        
        if (this.options.mangle) {
            ast.mangle_names();
        }
        
        code = ast.print_to_string();

        return code;        
    },
    

    /*
        logs message on terminal
        @api: private
    */    
    echoMsg: function(msg, tyyp) {
        "use strict";
        
        var arrow = 'crushit > ';
        
        if (tyyp === 'error') {
            arrow = chalk.red(arrow);
        }
        
        else if (tyyp === 'success') {
            arrow = chalk.green(arrow);
        }
        
        console.log(arrow + msg);  
    }
};

module.exports = CrushIt;

