
/*
    Dependencies
*/

var request = require('request'),
    cheerio = require('cheerio'),
    uglify = require('uglify-js'),
    helper = require('./helper'),
    path = require('path'),
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
    this.max = false;
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
           self.echoMsg('Error: unknown arguments, please check documentation');
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
                  self.echoMsg('Preparing to download external scripts....');
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
            src;
        
        request(website, function (err, response, body) {
            if (!err && response.statusCode === 200) {
                var $ = cheerio.load(body);
            
                $('script').each(function () {
                    src = $(this).attr('src');
            
                    if (src) {
                        self.externalScripts = true;
                        
                        scripts.push({type: 'absolute', data: src});
                        num_external++;
                        self.echoMsg('found external script(' + num_external + ') - ' + path.basename(src));
                    } 
                    else {
                        var inline = $(this).text();
                        inline = inline.replace(/<!--[\s\S]*?-->/g, "");
                    
                        scripts.push({type: 'inline', data: inline});
                    
                        num_inline++;
                        self.echoMsg('found inline script(' + num_inline + ')');
                    }
                });
            
                fn(false, scripts);
            }
            else {
                fn(err);
            }
        });        
    },
    

    /*
        Loads a script from a url
        @api: private
    */    
    loadScript: function (urlStr, website, fn, flag) {
        "use strict";
        
        var self = this, parsedUrl; 
        
        parsedUrl = helper.resolveUrl(urlStr, website, flag);
        
        self.echoMsg('downloading ' + parsedUrl);
        
        request(parsedUrl, function (error, response, script) {
            if (!error && response.statusCode === 200) {
                if (flag) {
                    self.echoMsg('Success: Loaded url without pathname: ' + parsedUrl);
                }
                else {
                    self.echoMsg('download complete: ' + path.basename(parsedUrl));
                }
                
                fn(false, script); 
            }
            // Try again using base url without pathname
            else if (!flag) {
                self.echoMsg('failed to load ' + parsedUrl + '\n Try again using base url without pathname');
                self.loadScript(urlStr, website, fn, true);
            }
            else {
                self.echoMsg('Error: failed to load ' + parsedUrl);
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
            ast = uglify.parse(script.data, {strict: self.strict});
            
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
    */
    maxCompression: function (code) {
        "use strict";
        
        var ast = uglify.parse(code), compressor; 
          
        // compressor - reduces the code size by applying various optimizations          
        ast.figure_out_scope();
        compressor = uglify.Compressor();
        ast = ast.transform(compressor);
        
        // Name Mangler - reduces names of local variables and functions        
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
    echoMsg: function(msg) {
        "use strict";
        
        console.log(' > %s', msg);  
    },
};

module.exports = CrushIt;

