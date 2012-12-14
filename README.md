# CrushIt

Ok here is the deal, I am currently developing a JavaScript intensive application <https://github.com/qawemlilo/nodebooks> and my front-end code is organised into modules of many different javaScript files. I wrote CrushIt so that I can easily compile and compress all scripts into one file that I can use in production without messing up my local development structure. 


# Install (npm)
```
npm install -g crushit
```

# CLI Usage
```
crushit -s [ website (url) ]

Note: does not compile any file name that has a substring of 'modernizr'. Modernizr should be left alone in the header section of an html document.
```


# To Do

- Add css support
- Write better docs
- Add login options to scrap logged view

# License

(MIT License)

Copyright (c) 2012 Qawelesizwe Mlilo <qawemlilo@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.