"use strict";

var pako = require("pako");
var stream = require("stream");

module.exports.createDeflate = function(options) {
  var deflate = new pako.Deflate(options);
  var strm = new stream.Transform;
  var cb = null;
  var chunks = [];
  deflate.onData = function(chunk) {
    chunks.push(new Buffer(chunk));
  };
  deflate.onEnd = function(status) {
    if (status === 0) {
      strm.push(Buffer.concat(chunks));
      strm.push(null);
      cb();
    } else {
      strm.emit("error", new Error(deflate.msg));
    }
  };
  strm._transform = function(chunk, encoding, callback) {
    var n = chunk.length;
    var arr = new Uint8Array(n);
    for (var i = 0; i < n; ++i) {
      arr[i] = chunk[i];
    }
    deflate.push(arr, false);
    callback();
  };
  strm._flush = function(callback) {
    cb = callback;
    deflate.push(new Uint8Array(0), true);
  };
  return strm;
}
