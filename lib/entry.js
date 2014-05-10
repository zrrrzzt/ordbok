'use strict';

/*
 Setup

 Entry: {
    word: ""
    , partOfSpeech: ""
    , origin: ""
    , interpretation:
      [
        {
          definition: ""
        }
      ]
 }
 */

// Constructor
function Entry(word) {
  this.word = word;
  this.partOfSpeech = "";
  this.wordsOrigin = "";
  this.interpretation = [];
}
// class methods
Entry.prototype.getObject = function getObject() {
  return {
      word: this.word
    , partOfSpeech: this.partOfSpeech
    , wordsOrigin: this.wordsOrigin
    , interpretation: this.interpretation
  };

};

// export the class
module.exports = Entry;