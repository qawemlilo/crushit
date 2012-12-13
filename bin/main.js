#!/usr/bin/env node

/*
    Dependencies
*/
var request = require('request'),
    cheerio = require('cheerio'),
    uglify = require('yuglify'),
    commander = require('commander'),
    fs = require('fs');
    
    
    
var crushIt = {
    website: '',
    
    
    raw: '',
    
    
    encoding: 'utf8',
    
    
    production: '',
    
    
    development: '',
    
    
    init: function (url) {
       var self = this;
       
       self.website = url;
       self.development = './script_' + (new Date().getTime()) + '.js';
       self.production = './script-min_' + (new Date().getTime()) + '.js';
    },
    
    
    parseUrl: function (url) {
        var lastCharIndex = (url.length - 1),
            lastChar = url[lastCharIndex];
            
        if (lastChar === '/') {
            url = url.substring(0, lastCharIndex); 
        }
        
        return url; 
    },
};