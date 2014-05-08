'use strict';

var cheerio = require('cheerio')
  ;

function doParse(data, callback){
  var result = {}
    , $ = cheerio.load(data)
    , bmList = []
    , nnList = []
    ;

  $('#byttutBM').find('tr').each(function(i, e){

    var tr = $(e)
      ;

    if(tr.attr('valign')){
      var word = tr.find('.oppslagdiv a').text()
        , type = tr.find('.oppsgramordklasse').text()
        ;

      bmList.push({word: word, type: type});
    }

  });

  $('#byttutNN').find('tr').each(function(i, e){

    var tr = $(e)
      ;

    if(tr.attr('valign')){
      var word = tr.find('.oppslagdiv a').text()
        , type = tr.find('.oppsgramordklasse').text()
        ;

      nnList.push({word: word, type: type});
    }

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