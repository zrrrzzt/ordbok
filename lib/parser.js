'use strict';

var cheerio = require('cheerio')
    ;

function parseData(data, callback) {
  var result = {}
      , $ = cheerio.load(data)
      ;

  function printSelector(word, selector) {
    console.log(" \n " + word + " ---------------------------------------------- \n")
    console.log(selector)
    console.log(" \n / " + word + " ---------------------------------------------- \n")
  }

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

    $("span").remove(".oppsgramordklassevindu");
    $("span").remove(".doemeliste");
    $("span").remove(".tydingC");

    selector = selector.html().toString();
    selector = selector.replace(/<style>(.*)<\/style>/g, "");
    selector = selector.replace(/<span style="font-style:[ \s]italic">(.*)+?<\/span>/g, "$1");

    var temp = $(selector).clone().children().remove().end().text();

    temp = temp.replace(/\'/g, "\"");
    temp = temp.trim();

    return temp;
  }

  function findWords(selector){
   var wordList = []
    ;

    $(selector).find('tr').each(function (i, e) {

      var tr = $(e)
        ;

      if (tr.attr('valign')) {
        var word = findTheWords(tr.find('.oppslagdiv'))
          , type = tr.find('.oppsgramordklasse').text()
          , definition = findDefinitions(tr.find('.artikkelinnhold'))
          ;

        wordList.push({word: word, type: type, definition: definition});
      }

    });

    return wordList;
  }

  result.bokmal = findWords('#byttutBM');
  result.nynorsk = findWords('#byttutNN');

  return callback(null, result);

}

module.exports = function (data, callback) {

  parseData(data, function (err, result) {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });

};
