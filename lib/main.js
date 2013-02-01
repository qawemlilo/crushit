
/*
    Dependencies
*/

var request = require('request'),
    cheerio = require('cheerio'),
    uglify = require('uglify-js'),
    fs = require('fs'),
    crushIt;
    

crushIt = function () {
    this.website = '';
    this.logs = [];
    this.scripts = [];
    this.directory = '';
    this.minify = false,
    this.stream = null;
    this.parserOptions = {};
}; 
  
    
crushIt.prototype = {

    /*
        Initializes Crushit
        @api: public
    */     
    init: function (opts) {
        var self = this, website = self.parseUrl(opts.website);
        
        if (!website) {
            self.onComplete({msg: 'Error, you need to specify a web page resource', error: true}, '');
            
            return false;
        }
        
        self.processOptions(opts);       
        self.stream = uglify.OutputStream({
            beautify: opts.beautify,
            comments: opts.comments
        });
       
        self.loadWebPage(function (err) {
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
        
        filename = self.directory + '/script_' + (new Date().getTime()) + '.js';
        
        if (code) {
            fs.writeFile(filename, code, 'utf8', function () {
                self.echoMsg('Success!! Scripts compiled and saved in ' + self.getFileName(filename));
            });
        }
        else {
            self.echoMsg(' Error, compilation failed!');
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

        var i = 0, x=0, self = this;
        
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
                        
                        self.log(' found external script(' + i + ') - ' + self.getFileName(src));
                    } 
                    else {
                        self.scripts.push({type: 'inline', data: $(this).text()});
                        
                        x++
                        self.log(' found inline script(' + x + ')');
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
        var self = this, ast, script, code;

        // let us check if we have any scripts in our scripts array
        if (!(self.scripts.length > 0)) {
            code = self.stream.toString();
            
            return self.onComplete(false, code); // we dont, we are done
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
    },
    
    
    /*
        @api: private
    */    
    log: function(msg) {
        console.log(msg);
        this.logs.push(msg);   
    }
};

module.exports = new crushIt;
