"use strict";

var rd = require("../");

var assert = require("assert");
var crc32 = require("buffer-crc32");

describe("createDeflate", function() {

  function compressAndCrc(expectedCrc, callback, options) {
    var actualCrc;
    var deflate = rd.createDeflate(options);
    deflate.on("error", callback);
    deflate.on("data", function(chunk) {
      actualCrc = crc32(chunk, actualCrc);
    });
    deflate.on("end", function() {
      actualCrc = actualCrc.readUInt32BE(0);
      if (expectedCrc !== actualCrc)
        return callback(new Error("0x" + expectedCrc.toString(16) +
                                  " !== 0x" + actualCrc.toString(16)));
      callback();
    });
    return deflate;
  }

  describe("should reproducibly compress the HOTPO sequence", function() {

    function hotpo(i) {
      var seq = [i];
      i = i|0;
      while (i > 1) {
        i = (i & 1) ? (3*i + 1)|0 : (i >> 1);
        seq.push(i);
      }
      return new Buffer(i + ": " + seq.join(",") + "\n");
    }

    it("for 910107", function(done) {
      var deflate = compressAndCrc(0x646fe97b, done);
      deflate.end(hotpo(910107));
    });
    it("for 1..999 in multiple chunks", function(done) {
      var deflate = compressAndCrc(0x6cbfdc8b, done);
      for (var i = 1; i <= 999; ++i)
        deflate.write(hotpo(i));
      deflate.end();
    });
    it("for 1..999 in one chunk", function(done) {
      var deflate = compressAndCrc(0x6cbfdc8b, done);
      var chunks = [];
      for (var i = 1; i <= 999; ++i)
        chunks.push(hotpo(i));
      deflate.end(Buffer.concat(chunks));
    });
  });
});
