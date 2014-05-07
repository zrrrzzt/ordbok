#!/usr/bin/env node
'use strict';

var ordbok = require('./index')
  , pkg = require('./package.json')
  , query = process.argv[2]
  ;

function printHelp() {
  console.log(pkg.description);
  console.log('');
  console.log('Usage:');
  console.log('  $ ordbok <query>');
}

if (!query || process.argv.indexOf('-h') !== -1 || process.argv.indexOf('--help') !== -1) {
  printHelp();
  return;
}

if (process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--version') !== -1) {
  console.log(pkg.version);
  return;
}

ordbok({word:query}, function(err, data){
  if(err) {
    throw err;
  }
  console.log(data);
});