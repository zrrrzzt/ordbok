'use strict';

var ordbok = require('../index')
  , assert = require('assert')
  ;

describe('ordbok - inputs', function(){

  it('Should throw if word is not specified', function(done){
    var opts = {};
    ordbok(opts, function(err, data){
      assert.throws(function(){
          if(err) {
            throw err;
          }
        }, function(err){
          if((err instanceof Error) && /Missing required param: word/.test(err)){
            return true;
          }
        },
        "Unexpected error"
      );
      done();
    });
  });

});