'use strict';

var EventEmitter = require("events").EventEmitter
  , cheerio = require('cheerio')
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

function findOrigin($, article){
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

  return origin;
}

function findWord($, tr, callback){
  var paradigmId = tr.find('span.oppslagsord.b').attr('id')
    , article = tr.find(".artikkelinnhold")
    , word = findEntry($, tr.find('.oppslagdiv'))
    , entry = new entryObject(word)
    ;

  // PART OF SPEECH
  entry.partOfSpeech = tr.find('.oppsgramordklasse').text();

  // INTERPRETATION
  entry.interpretation = findInterpretation($, tr, article);

  // ORIGIN
  entry.wordsOrigin = findOrigin($, article);

  getParadigm(paradigmId, function(err, data){
    if(err){
      return callback(err);
    }
    entry.paradigm = data;

    return callback(null, entry.getObject());
  });

}

function findWords($, selector, callback) {
  var glossary = []
    , queController = new EventEmitter()
    , workList = []
    , queCounter = 0
    ;

  queController.on("finished", function(){
    return callback(null, glossary);
  });

  $(selector).find('tr').each(function (index, element) {

    var tr = $(element)
      ;

    if (tr.attr('valign')) {
      workList.push(tr);
    }
  });

  queCounter = workList.length;

  workList.forEach(function(tr){
    findWord($, tr, function(err, entry){
      if(err){
        return callback(err, null);
      }
      queCounter--;
      glossary.push(entry);

      if(queCounter === 0){
        queController.emit("finished");
      }

    });

  });
}

function parseData(data, callback) {
  var queController = new EventEmitter()
    , result = {}
    , $ = cheerio.load(data)
    , langList = [['bokmal', '#byttutBM'], ['nynorsk', '#byttutNN']]
    , queCounter = langList.length
    ;

  queController.on("finished", function(){
    return callback(null, result);
  });

  langList.forEach(function(lang){
    var thisLang = lang
      ;

    findWords($, $(thisLang[1]), function(err, data){
      if(err){
        return callback(err, null);
      }
      queCounter--;

      result[thisLang[0]] = data;
      if(queCounter === 0){
        queController.emit("finished");
      }

    });
  });

}

module.exports = function (data, callback) {

  parseData(data, function (err, result) {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });

};
