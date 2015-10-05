'use strict';

var gutil   = require("gulp-util");
var through = require("through2");
var querySelectorAll = require("query-selector");
var jsdom = require("jsdom").jsdom;

function gulpError(message) {
  return new gutil.PluginError('gulp-query-selector', message)
}

module.exports = function(selector) {

  if (typeof selector !== 'string') {
    self.emit('error', gulpError("no selector given"));
    return callback();
  }

  var paths = [];

  function querySelector(file, enc, callback) {
    var self = this;

    if (file.isNull()) {
      self.push(file);
      return callback();
    }

    if (file.isStream()) {
      // TODO streams support
      self.emit('error', gulpError("Streams are not supported"));
      return callback();
    }

    function runQuery() {
      try {
        var doc = jsdom(new String(file.contents));
        var results = querySelectorAll(selector, doc);
        return results;

      } catch (e) {
        self.emit('error', gulpError(e));
        return [];
      }
    }

    var results = runQuery();
    results.forEach(function(node, i) {
      var resultFile = new gutil.File({
        path: file.path +'.selection-'+ ('0000'+ i).slice(-4) +'.html',
        contents: new Buffer(node.outerHTML),
      });
      resultFile.sourceFile = file;
      self.push(resultFile);
    });
    return callback();
  }

  return through.obj(querySelector);
};

module.exports.groupBySource = function() {
  var groups = {};

  function aggregate(file, enc, callback) {
    if (!file.sourceFile) {
      this.emit('error', gulpError('querySelector.groupBySource may be used only immediately after querySelector'));
      return callback();
    }
    var group = groups[file.sourceFile.path] = groups[file.sourceFile.path] || [];
    group.push(new String(file.contents));
    return callback();
  }

  function group(callback) {
    var self = this;
    Object.keys(groups).forEach(function(path) {
      var group = groups[path];
      self.push(new gutil.File({ path: path, contents: new Buffer(group.join('\n')) }));
    });
    return callback();
  }

  return through.obj(aggregate, group);
};

