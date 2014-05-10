'use strict';

var cheerio = require('cheerio')
  , tools = require('./tools')
  , entryObject = require('./entry')
  ;

function parseData(data, callback) {
  var result = {}
    , $ = cheerio.load(data)
    ;

  function findEntry(selector) {
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

  function findWord(selector) {
    var glossary = []
      ;

    $(selector).find('tr').each(function (index, element) {

      var tr = $(element)
        ;

      if (tr.attr('valign')) {

        var word = findEntry(tr.find('.oppslagdiv'));

        var entry = new entryObject(word);


        // PART OF SPEECH
        entry.partOfSpeech = tr.find('.oppsgramordklasse').text();


        // INTERPRETATION
        var article = tr.find(".artikkelinnhold");
        $(article).find("span").remove(".oppsgramordklassevindu");

        var expanded = $(article).find("span.utvidet");
        $(expanded).find("span").remove(".kompakt");

        var interpretation = [];
        $(expanded).find(".tyding").each(function (index, element) {
          interpretation.push({definition: $(element).text()});
        });

        entry.interpretation = interpretation;


        // ORIGIN OF THE WORD
        // CLEAN UP SOME
        $(article).find("span").remove(".utvidet");
        $(article).find("span").remove(".tydingC");

        article = article.html().toString();
        article = article.replace(/<style>(.*)<\/style>/g, "");
        article = article.replace(/<span style="font-style:[ \s]italic">(.*)+?<\/span>/g, "$1");

        var origin = $(article).clone().children().remove().end().text();
        origin = origin.replace(/\'/g, "\"");
        origin = origin.trim();
        entry.wordsOrigin = origin;

        glossary.push(entry.getObject());
      }
    });

    return glossary;
  }

  result.bokmal = findWord($('#byttutBM'));
  result.nynorsk = findWord($('#byttutNN'));

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
