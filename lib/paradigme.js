'use strict';

var request = require('request')
  , cheerio = require('cheerio')
  , uriBM = 'http://www.nob-ordbok.uio.no/perl/bob_hente_paradigme.cgi'
  , uriNN = 'http://www.nob-ordbok.uio.no/perl/nob_hente_paradigme.cgi'
  ;

function downloadPage(id, lang, callback){
  var uri = lang === 'BM' ? uriBM:uriNN
    ;

  request(uri, {qs:{lid:id}}, function(err, response, body){
    if(err){
      return callback(err, null);
    }
    return callback(null, body.toString());
  });

}

function parsePage(page, callback){
  var $ = cheerio.load(page)
    , result = []
  ;

  $('.vanlig').each(function(i, e){
    result.push($(e).text());
  });

  return callback(null, result);
}

module.exports = function(id, lang, callback){

  if(!id || !lang){
    return callback(new Error('Missing required params'), null);
  }

  downloadPage(id, lang, function(err, page){
    if(err){
      return callback(err, null);
    }
    parsePage(page, function(error, result){
      if(error){
        return callback(error, null);
      }
      return callback(null, result);
    });
  });

};