
/*
    Dependencies
*/

var Crushit = require('./main'), 
    App;


App = Object.create({});

    
App.crushScripts = App.optimise = function (website, options) {
    var opts = {};
    
    // website not specified
    if (!website) {
        callback(false);
    }
    
    
    // options not specified
    if (!options) {
        options = {};
    }
    
        
    // beautify specified in options
    if (options.hasOwnProperty('beautify')) {
        opts.beautify = options.beautify;
    }
    else {
        opts.beautify = false;
    }
    
    
    // strict specified in options
    if (options.hasOwnProperty('strict')) {
        opts.strict = options.strict;
    }
    else {
        opts.strict = false;
    }
    
    
    // onComplete specified in options
    if (options.hasOwnProperty('onComplete')) {
        opts.onComplete = options.onComplete;
    }
    else {
        opts.onComplete = function (code) {
            App.code = code;
        };
    }
    
    
    opts.website = website;
    
    
    Crushit.init(opts);         
};


module.exports = App;