'use strict'

module.exports = {

  /**
   * This method Prints the selector passed into it, and wraps it some horizontal lines and the word to make it easily visible
   * @param {String} word
   * @param {String} selector
   */
  printSelector: function (word, selector) {
    console.log(' \n ' + word + ' ---------------------------------------------- \n')
    console.log(selector)
    console.log(' \n / ' + word + ' ---------------------------------------------- \n')
  }

}
