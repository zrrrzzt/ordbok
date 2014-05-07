'use strict';

var cheerio = require('cheerio')
  ;

function doParse(data, callback){
  var result = {}
    , $ = cheerio.load(data)
    , bm_list = []
    , nn_list = []
    ;

  $('#byttutBM .oppslagdiv a').each(function(i, e){
    bm_list.push({word: $(e).text()});
  });

  $('#byttutNN .oppslagdiv a').each(function(i, e){
    nn_list.push({word: $(e).text()});
  });

  result.bokmal = bm_list;
  result.nynorsk = nn_list;

  return callback(null, result);

};

module.exports = function(data, callback){

  doParse(data, function(err, result){
    if(err){
      return callback(err, null);
    }
    return callback(null, result);
  });

};