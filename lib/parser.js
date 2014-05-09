'use strict';

var cheerio = require('cheerio')
    ;

function doParse(data, callback) {
  var result = {}
      , $ = cheerio.load(data)
      , bmList = []
      , nnList = []
      ;

  function findTheWords(selector) {
    var word = "";
    var words = $(selector).find('a');
    $(words).each(function (index, element) {
      if (index < words.length - 1) {
        word += $(element).text() + ", ";
      }
      else {
        word += $(element).text();
      }
    });
    return word;
  }

  function findDefinitions(selector) {
    selector = selector.html().split("<span class=\"doemeliste kompakt\">")[0];
    selector = selector.replace(/<style>(.*)<\/style>/g, "");
    selector = selector.replace(/<span style="font-style:[ \s]italic">(.*)+?<\/span>/g, "$1");
    selector = selector.replace(/<span class="tydingC kompakt">(.*)+?<\/span>/g, "");

    var temp = $(selector).clone().children().remove().end().text();

    temp = temp.replace(/\'/g, "\"");
    temp = temp.trim();

    return temp;
  }

  $('#byttutBM').find('tr').each(function (i, e) {

    var tr = $(e)
        ;

    if (tr.attr('valign')) {
      var word = findTheWords(tr.find('.oppslagdiv'))
          , type = tr.find('.oppsgramordklasse').text()
          , definition = findDefinitions(tr.find('.artikkelinnhold'))
          ;

      bmList.push({word: word, type: type, definition: definition});
    }

  });

  $('#byttutNN').find('tr').each(function (i, e) {

    var tr = $(e)
        ;

    if (tr.attr('valign')) {
      var word = findTheWords(tr.find('.oppslagdiv'))
          , type = tr.find('.oppsgramordklasse').text()
          , definition = findDefinitions(tr.find('.artikkelinnhold'))
          ;

      nnList.push({word: word, type: type, definition: definition});
    }

  });

  result.bokmal = bmList;
  result.nynorsk = nnList;

  return callback(null, result);

}

module.exports = function (data, callback) {

  doParse(data, function (err, result) {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });

};
