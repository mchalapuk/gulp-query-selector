# gulp-query-selector
[![Build Status][travis-image]][travis-url]
[![Dependency Status][david-image]][david-url]
[![devDependency Status][david-image-dev]][david-url-dev]
[![NPM version][npm-image]][npm-url]

Selects DOM nodes from Node.js streams and packs selected code into separated streams.

## Usage

First, install `gulp-query-selector` as a development dependency:

```shell
npm install --save-dev gulp-query-selector
```

Then, add it to your `gulpfile.js`:

```javascript
var querySelector = require("gulp-query-selector");
var inject = require("gulp-inject");

gulp.task("make-html", function(){
  var partials = gulp.src("pages/*.html")
    .pipe(querySelector("body > *"))
    .pipe(querySelector.groupBySource());
  return gulp.src("index.html")
    .pipe(inject(partials), {
      starttag: '<!-- inject:partials -->',
      transform: function (filePath, file) { return file.contents.toString('utf8'); }
    })
    .pipe(gulp.dest("./dist"));
});
```
Above example is pretty complicated, but it's the simplest one I've been able to come up with. It
selects contents of `<body>` elements from all HTML files found in `pages` forlder, and then injects
these contents to another HTML code using [gulp-inject](https://github.com/klei/gulp-inject) plugin.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[travis-url]: http://travis-ci.org/webfront-toolkit/gulp-query-selector
[travis-image]: https://secure.travis-ci.org/webfront-toolkit/gulp-query-selector.png?branch=master

[david-url]: https://david-dm.org/webfront-toolkit/gulp-query-selector
[david-image]: https://david-dm.org/webfront-toolkit/gulp-query-selector.svg

[david-url-dev]: https://david-dm.org/webfront-toolkit/gulp-query-selector?type=dev
[david-image-dev]: https://david-dm.org/webfront-toolkit/gulp-query-selector/dev-status.svg

[npm-url]: https://npmjs.org/package/gulp-query-selector
[npm-image]: https://badge.fury.io/js/gulp-query-selector.svg

