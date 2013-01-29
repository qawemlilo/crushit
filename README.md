# CrushIt

CrushIt is a commandline tool for compiling, concatenating, and minifying scripts from a web page. I wrote CrushIt to make it easy to optimize my code for use in production. 

[![Build Status](https://travis-ci.org/qawemlilo/crushit.png)](https://travis-ci.org/qawemlilo/crushit)


# Install (npm)
```
npm install -g crushit
```

# Usage
```
# Basic usage
crushit [options] [url]


# Beautify code 
crushit -b [url]


# Use strict parser mode 
crushit -s [url]


# Beautify code and use strict parser mode
crushit -bs [url]
```

# Example
```
# Optimizing apple.com scripts
crushit http://www.rflab.co.za
```

# To Do

- Add css minification
- Write better docs

# License

(MIT License)

Copyright (c) 2012 Qawelesizwe Mlilo <qawemlilo@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.