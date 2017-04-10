'use strict';

var request = require('request')
  , uri = 'http://ordbok.uib.no/perl/ordbok.cgi'
  , parser = require('./lib/parser')
  , reqOpts = {
      begge: '+&ordbok=begge'
    }
  ;

module.exports = function(opts, callback){

  if(!opts.word){
    return callback(new Error('Missing required param: word'), null);
  }

  reqOpts.OPP = opts.word;

  request(uri, {qs:reqOpts}, function(error, response, body){
    if (error) {
      return callback(error, null);
    }

    parser(body.toString(), function(err, data){
      if(err){
        return callback(err, null);
      }
      return callback(null, data);
    });

  });
};