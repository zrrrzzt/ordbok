'use strict';

var cheerio = require('cheerio')
  , tools = require('./tools')
  , entryObject = require('./entry')
  , getParadigm = require('./paradigme')
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

        var paradigmId = tr.find('span.oppslagsord.b').attr('id');

        var entry = new entryObject(word);

        // PART OF SPEECH
        entry.partOfSpeech = tr.find('.oppsgramordklasse').text();

        var article = tr.find(".artikkelinnhold");
        var interpretation = [];
        $(article).find("span").remove(".oppsgramordklassevindu");

        // INTERPRETATION
        if($(".artikkelinnhold > span.utvidet", tr).children().length > 0){

          // TODO: Check if the div.tydig exists if not there should be another way to handle the definition

          $(".artikkelinnhold > span.utvidet > div.tyding.utvidet", tr).each(function(){

            $(this).find(".kompakt").each(function(){
              $(this).remove();
            });

            var test = $(this).text();
            $(this).children(".tyding").each(function(){
              $(this).find(".kompakt").each(function(){
                $(this).remove();
              });

              test += $(this).text();
            });

            if(test !== null) {
              interpretation.push({definition: test});
            }
          });

        }

        if(interpretation.length === 0) {
          var short = $(article).find(".utvidet").clone().children().remove().end().text();
          interpretation.push({definition: short});
        }

        entry.interpretation = interpretation;

        // Removing the classes kompakt and tydingC failes if the classes are missing.
        // TODO: check if the classes exists
//        if($(".artikkelinnhold > span.utvidet", tr).children().length > 0){
//          // Since there is more levels
//          $(article).find(".tydingC").each(function(){
//            $(this).remove();
//          });
//          $(article).find(".kompakt").each(function(){
//            $(this).remove();
//          });
//        }

        // ORIGIN OF THE WORD
        // CLEAN UP SOME
        $(article).find("span").remove(".utvidet");

        article = article.html().toString();
        article = article.replace(/<style>(.*)<\/style>/g, "");
        article = article.replace(/<span style="font-style:[ \s]italic">(.*)+?<\/span>/g, "$1");

        var origin = $(article).clone().children().remove().end().text();
        origin = origin.replace(/\'/g, "\"");
        origin = origin.trim();
        entry.wordsOrigin = origin;

        getParadigm(paradigmId, function(err, data){
          if(err){
            return callback(err, null);
          }
          entry.paradigm = data;

          glossary.push(entry.getObject());
        });

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
