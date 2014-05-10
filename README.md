#ordbok [![Build Status](https://travis-ci.org/zrrrzzt/ordbok.svg?branch=master)](https://travis-ci.org/zrrrzzt/ordbok)

Node.js module/CLI app for querying nob-ordbok.uio.no

##Installation

```
$ npm install ordbok
```

You can also install it globally to use the CLI version.

```
$ npm install ordbok -g
```

##Test

Make sure you have installed [Mocha](http://visionmedia.github.io/mocha/) globally or go to the ordbok folder and do an nmp install.

```
$ npm test
```

##Usage

Pass an object with the required property and receive the result.

**word** String you want to lookup.

```javascript
var ordbok = require('ordbok')
  , opts = {
      word:'syltelabb'
    }
  ;

ordbok(opts, function(err, data){
  if(err)throw err;
  console.log(data);
});
```

##CLI

To use it as a CLI app install it globally.

To display help

```
$ ordbok --help
```

To display version

```
$ ordbok --version
```

###Usage

```
$ ordbok <query>
```


### Output

```
{"bokmal":
  [
    {
      "word": String ,
      "partOfSpeech": String ,
      "wordsOrigin": String ,
      "interpretation": [
        {
          "definition": String
        }
      ]
    }
  ]
  , "nynorsk":
  [
    {
      "word": String ,
      "partOfSpeech": String ,
      "wordsOrigin": String ,
      "interpretation": [
        {
          "definition": String
        }
      ]
    }
  ]
}

```