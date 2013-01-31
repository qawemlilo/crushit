
/*
    Dependencies
*/

var Crushit = require('./main'), 
    App;


App = Object.create({});

    
App.crushScripts = App.optimise = function (website, options) {
    var opts = {};
    
    
    if (!options || !options.hasOwnProperty('onComplete')) {
        return false;
    }
    
    // website not specified
    if (!website) {
        options.onComplete({error: true, msg: 'You did not provide a url'}, '');
    }
    
        
    // beautify specified in options
    if (options.hasOwnProperty('beautify')) {
        opts.beautify = options.beautify;
    }
    else {
        opts.beautify = false;
    }
    
    
    // comments specified in options
    if (options.hasOwnProperty('comments')) {
        opts.comments = options.comments;
    }
    else {
        opts.comments = false;
    }
    
    // strict specified in options
    if (options.hasOwnProperty('strict')) {
        opts.strict = options.strict;
    }
    else {
        opts.strict = false;
    }
    
    
    opts.onComplete = options.onComplete;
    opts.website = website;
    
    
    Crushit.init(opts);         
};


module.exports = App;