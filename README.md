# CrushIt

CrushIt is a commandline tool for crawling web pages and compiling scripts.

[![Build Status](https://travis-ci.org/qawemlilo/crushit.png)](https://travis-ci.org/qawemlilo/crushit)


## Install (npm)
```
npm install -g crushit
```

## Usage
```
# Basic usage
crushit [options] [url] [file]


## Beautify output code 
crushit -b [url]


## Include comments in the output code
crushit -c [url]


## Perform maximum optimisation
crushit -x [url] [output filename]


## Beautify output code and include comments
crushit -bc [url]
```

## CLI Examples
```
# Compiling scripts from my website with default options
crushit http://www.ragingflame.co.za

# Compiling scripts from my website with options and specifying an output file
crushit -xm http://www.ragingflame.co.za crushed.js
```

## You can also include CrushIt in your node programs
```
var crushit = require("crushit");

crushit.squeeze(options, callback);

# options
website  - (String)   Web page URL
comments - (Boolean)  Keep comments
beatify  - (Boolean)  Beautify output code
mangle   - (Boolean)  Mangle variable names
max      - (Boolean)  Perform maximum optimisation
callback - (Function) Callback function that takes 2 arguments, the first one is an error flag or object and the second one is the output code
```


## Program Example
```
var crushit = require("crushit");

crushit.squeeze({
    website: "http://www.ragingflame.co.za",
    comments: false,
    beatify: false,
    mangle: true,
    max: true,
}, 
function (error, code) {
    if (error) {
        console.log(error.msg);   
    }
    else {
        console.log(code);
    }
});
```


## Short Code

The `options` argument may also be a string variable
```
var crushit = require("crushit");

crushit.squeeze("http://www.ragingflame.co.za", function (error, code) {
    if (error) {
        console.log(error.msg);   
    }
    else {
        console.log(code);
    }
});
```



## License

(MIT License)

Copyright (c) 2012 Qawelesizwe Mlilo <qawemlilo@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.