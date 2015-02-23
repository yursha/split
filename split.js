#!/usr/bin/env node

/*
 * Splits large files into chunks of 1 MiB
 */

var fs = require('fs')

var file = process.argv[2]

var ONE_MIB = 1048576 // // 1 MiB
var CHUNK_SIZE = ONE_MIB

fs.stat(file, function (err, stats) {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  if (stats.isDirectory()) {
    console.error(file + ' is a directory, but must be a file')
    process.exit(1)
  }

  if (stats.size < CHUNK_SIZE) {
    console.log(file + ' is less than ' + CHUNK_SIZE / ONE_MIB + ' MiB, won\'t be split')
    process.exit(1)
  }

  console.log(file + ' is ' + stats.size + ' bytes long')
  var chunks = Math.ceil(stats.size / CHUNK_SIZE)
  console.log(file + ' will be split into ' + chunks)

  var readStream
  var writeStream
  var start
  var end
  for (var i = 0; i < chunks; i++) {
    start = CHUNK_SIZE * i
    end = start + CHUNK_SIZE - 1
    readStream = fs.createReadStream(file, { flags: 'r', encoding: 'utf8', start: start, end: end })
    writeStream = fs.createWriteStream(file + i, { flags: 'w', encoding: 'utf8', mode: 0666 })
    readStream.pipe(writeStream)
  }

})
