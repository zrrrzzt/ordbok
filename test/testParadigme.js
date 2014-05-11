'use strict';

var paradigme = require('../lib/paradigme')
  , assert = require('assert')
  ;

describe('Paradigme', function(){

  it('Should return a list with 4 words', function(done){

    var id = '50975'
      , lang = 'BM'
      ;

    paradigme(id, lang, function(err, list){

      if(err){
        throw err;
      }

      assert.equal(4, list.length);

      done();

    });

  });

});