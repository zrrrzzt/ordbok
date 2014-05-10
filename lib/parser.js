'use strict';

var cheerio = require('cheerio')
  , tools = require('./tools')
  , entryObject = require('./entry')
  , getParadigm = require('./paradigme')
  ;

function findEntry($, selector) {
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

function findInterpretation($, tr, article){
  var interpretation = [];
  $(article).find("span").remove(".oppsgramordklassevindu");
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

  return interpretation;
}


function findWord($, tr){
  var paradigmId = tr.find('span.oppslagsord.b').attr('id')
    , article = tr.find(".artikkelinnhold")
    , word = findEntry($, tr.find('.oppslagdiv'))
    , entry = new entryObject(word)
    ;

  // PART OF SPEECH
  entry.partOfSpeech = tr.find('.oppsgramordklasse').text();

  // INTERPRETATION
  entry.interpretation = findInterpretation($, tr, article);

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


  //TODO: This is async... will need to make the rest of the functions async as well
  getParadigm(paradigmId, function(err, data){
    if(err){
      throw err;
    }
    entry.paradigm = data;
  });

  return entry.getObject();
}

function findWords($, selector) {
  var glossary = []
    ;

  $(selector).find('tr').each(function (index, element) {

    var tr = $(element)
      ;

    if (tr.attr('valign')) {

      var entry = findWord($, tr)
        ;

      glossary.push(entry);
    }
  });

  return glossary;
}

function parseData(data, callback) {
  var result = {}
    , $ = cheerio.load(data)
    ;

  result.bokmal = findWords($, $('#byttutBM'));
  result.nynorsk = findWords($, $('#byttutNN'));

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
