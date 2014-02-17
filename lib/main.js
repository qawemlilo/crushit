
/*
    Dependencies
*/

"use strict";

var request = require('request'),
    cheerio = require('cheerio'),
    uglify = require('uglify-js'),
    helper = require('./helper'),
    scripts = [],
    fs = require('fs'),
    path = require('path'),
    CrushIt;


CrushIt = function () {
    this.website = '';
    this.logs = [];
    this.scripts = [];
    this.directory = '';
    this.minify = false;
    this.stream = null;
    this.options = {};
    this.max = false;
}; 


  
    
CrushIt.prototype = {

    /*
        Initializes CrushIt
        @api: public
    */     
    crushScripts: function (opts, callback) {
        var self = this, website = helper.parseUrl(opts.website);
        
        if (!website) {
            self.onComplete({msg: 'Error, you need to specify a web page resource', error: true}, '');
            
            return false;
        }
        
        self.processOptions(opts);
        
        self.stream = uglify.OutputStream({
            beautify: opts.beautify,
            comments: opts.comments
        });
       
        self.loadWebPage(self.website, function (err) {
            if (err) {
                self.onComplete({msg: ' Error, could load website: ' + self.website, error: true}, '');               
            }
            else {
              self.loadScripts();
            }
        });
        
        return self;
    },
    
    
    

    /*
        Initializes CrushIt
        @api: public
    */     
    init: function (opts) {
        var self = this, website = helper.parseUrl(opts.website);
        
        if (!website) {
            self.onComplete({msg: 'Error, you need to specify a web page resource', error: true}, '');
            
            return false;
        }
        
        self.processOptions(opts);
        
        self.stream = uglify.OutputStream({
            beautify: opts.beautify,
            comments: opts.comments
        });
       
        self.loadWebPage(self.website, function (err) {
            if (err) {
                self.onComplete({msg: ' Error, could load website: ' + self.website, error: true}, '');               
            }
            else {
              self.loadScripts();
            }
        });
        
        return self;
    },
       
    
    
    
    onComplete: function (err, code) {
        var self = this, filename;
        
        if (err) {
            self.echoMsg(err.msg);
            return;            
        }
        
        filename = path.join(self.directory, 'script_' + (new Date().getTime()) + '.js');
        
        if (code) {
            fs.writeFile(filename, code, 'utf8', function () {
                self.echoMsg('Success!! Scripts compiled and saved in ' + helper.getFileName(filename));
            });
        }
        else {
            self.echoMsg(' Error, compilation failed!');
        }
    },
    
    
    

    /*
        Loads a web page and reads its scripts
        @api: private
    */     
    loadWebPage: function (website, fn) {

        var i = 0, x=0, self = this;
        
        //Reset 
        if (self.scripts.length > 0) {
            self.scripts = [];   
        }
        
        request(website, function (err, response, body) {
            if (!err && response.statusCode === 200) {
                var $ = cheerio.load(body);
            
                $('script').each(function () {
                    var src = $(this).attr('src');
            
                    if (src) {
                        self.scripts.push({type: 'absolute', data: src});
                        i++;
                    
                        self.log(' found external script(' + i + ') - ' + helper.getFileName(src));
                    } 
                    else {
                        var inline = $(this).text();
                        inline = inline.replace(/<!--[\s\S]*?-->/g, "");
                    
                        self.scripts.push({type: 'inline', data: inline});
                    
                        x++;
                        self.log(' found inline script(' + x + ')');
                    }
                });
            
                fn(false, self.scripts);
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
        var self = this, ast, script, code;

        // let us check if we have any scripts in our scripts array
        if (self.scripts.length) {
            code = self.stream.toString();
            
            if (self.max) {
                code = self.maxCompression(code);
            }
            
            return self.onComplete(false, code); // we dont, we are done
        }
        
        script = self.scripts.shift(); // we do, grab first in line
        
        // inline script
        if (script.type === 'inline') {
            // incase it fails
            try {
                ast = uglify.parse(script.data, {strict: self.strict}); // parse the javascript
                ast.print(self.stream);  // write it to our stream
            
                self.loadScripts();
            }
            catch (err) {
                self.onComplete({msg:'JavaScript Parse Error!! Its possible that your page contains JavaScript with html comments', error: true}, '');    
            }
        }
        
        // script in a file
        else if (script.type === 'absolute') {
            self.loadScript(script.data, function (error, js) {
                if (!error) {
                    try {
                        ast = uglify.parse(js); // parse the javascript
                        ast.print(self.stream); // write it to our stream
                
                        self.loadScripts();
                    }
                    catch(err) {
                         self.onComplete({msg:'JavaScript Parse Error!! Its possible that your page contains JavaScript with html comments', error: true}, ''); 
                    }
                }
                else {
                    self.onComplete({msg:'Error!! Failed to load ' + script.data, error: true}, '');               
                }
            });
        }
        
        // unknown script type
        else {
            console.log('Script type error');
        }        
    },
    
    
    
    /*
        Performs maximun compression
    */
    maxCompression: function (code) {
        var ast = uglify.parse(code), compressor; 
          
        // compressor - reduces the code size by applying various optimizations          
        ast.figure_out_scope();
        compressor = uglify.Compressor();
        ast = ast.transform(compressor);
        
        // Name Mangler - reduces names of local variables and functions        
        ast.figure_out_scope();
        ast.compute_char_frequency();
        ast.mangle_names();
        
        code = ast.print_to_string(); // get compressed code

        return code;        
    },
     
    
    

    /*
        Loads a script from a url
        @api: private
    */    
    loadScript: function (urlStr, fn, flag) {
        var self = this, parsedUrl; 
        
        parsedUrl = helper.resolveUrl(urlStr, self.website, flag);
        
        process.nextTick(function() {
            request(parsedUrl, function (error, response, script) {
                if (!error && response.statusCode === 200) {
                    if (flag) {
                        console.log('Succes! Using base url without pathname: ' + parsedUrl);
                    }
                    fn(false, script); 
                }
                // Try again using base url without pathname
                else if (!flag) {
                    console.log('failed to load ' + parsedUrl + '. Try again using base url without pathname');
                    self.loadScript(urlStr, fn, true);
                }
                else {
                    console.log('failed to load ' + parsedUrl);
                    fn(true, '');
                }
            });
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
    },
    
    
    
    
    
    /*
        @api: private
    */    
    log: function(msg) {
        console.log(msg);
        this.logs.push(msg);   
    }
};

module.exports = new CrushIt();
