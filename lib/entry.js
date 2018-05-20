'use strict'

/*
 Setup

 Entry: {
    word: ""
    , partOfSpeech: ""
    , paradigm:
       [
       ""
       ]
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
function Entry (word) {
  this.word = word
  this.partOfSpeech = ''
  this.paradigm = []
  this.wordsOrigin = ''
  this.interpretation = []
}
// class methods
Entry.prototype.getObject = function getObject () {
  return {
    word: this.word,
    partOfSpeech: this.partOfSpeech,
    paradigm: this.paradigm,
    wordsOrigin: this.wordsOrigin,
    interpretation: this.interpretation
  }
}

// export the class
module.exports = Entry
