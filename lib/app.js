
/*
    Dependencies
*/

var Crushit = require('./main'), 
    App;


App = Object.create({});

    
App.crushScripts = function (website, options) {
    var opts = {};
    
    
    if (!options || !options.hasOwnProperty('onComplete')) {
        console.log("No options specified");
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
    
    // max specified in options
    if (options.hasOwnProperty('max')) {
        opts.max = options.max;
    }
    else {
        opts.max = false;
    }
    
    
    opts.onComplete = options.onComplete;
    opts.website = website;
    
    
    Crushit.init(opts);

    App.logs = Crushit.logs;    
};



App.getLogs = function () {
    return Crushit.logs;
};


module.exports = App;