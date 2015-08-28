# reproducible-deflate for node and iojs

**Alternative to [`zlib.createDeflate`](https://nodejs.org/api/zlib.html#zlib_zlib_createdeflate_options) with guaranteed reproducibility.**

[![Travis build status](https://api.travis-ci.org/gagern/npm-reproducible-deflate.svg?branch=master)](https://travis-ci.org/gagern/npm-reproducible-deflate)

Sometimes (e.g. when performing automated regression tests) it is important that the same input will always be compressed to the same output.
Since the `zlib` library of node.js ships with node.js, and might even depend on the operating system in addition to the node.js version number. that can make no such guarantees.
Therefore, we use a *fixed version* of the JavaScript-only implementation [pako](https://www.npmjs.com/package/pako) to offer reproducible results.

## Installation

```sh
npm install reproducible-deflate
```

## Usage

```js
// Load the library
var rd = require("reproducible-deflate");

// create a deflate stream
var deflate = rd.createDeflate(options);

// use the deflate stream
deflate.pipe(output);
deflate.data(input);
deflate.end();
```

## Options

The options to `createDeflate` are passed on to [pako.Deflate](http://nodeca.github.io/pako/#Deflate.new).
