'use strict';

var cheerio = require('cheerio')
  ;

function doParse(data, callback){
  var result = {}
    , $ = cheerio.load(data)
    , bmList = []
    , nnList = []
    ;

  $('#byttutBM').find('.oppslagdiv a').each(function(i, e){
    bmList.push({word: $(e).text()});
  });

  $('#byttutNN').find('.oppslagdiv a').each(function(i, e){
    nnList.push({word: $(e).text()});
  });

  result.bokmal = bmList;
  result.nynorsk = nnList;

  return callback(null, result);

}

module.exports = function(data, callback){

  doParse(data, function(err, result){
    if(err){
      return callback(err, null);
    }
    return callback(null, result);
  });

};