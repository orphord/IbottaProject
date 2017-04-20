var express = require('express');
var lib = require('./library');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

/**
 * Add the words in the 'words' array into the dictionary file.
 */
router.post('/words.json', function(req, res) {
	
	// loop thru words from request and add to corpus
  req.body.words.forEach( (word) => {
		if(typeof lib.dictionary[word.toLowerCase()] === 'undefined') {
			lib.dictionary[word.toLowerCase()] = word;
		}
  });

  res.status(201).json();
});

/**
 * Return the set of words that exist in the current state of the dictionary. If
 * 'limit' parameter is passed, return max of that number of words.
 */
router.get('/anagrams/:word.json', function(req, res) {
	var lim = req.query.limit;
	var inclProper = req.query.inclProper === 'y' ? true : false;

	// Get set of anagrams from dictionary
	var anagramsToReturn = lib.anagrams(req.params.word, inclProper);
	if(!isNaN(lim)) { // Handle limit parameter by slicing first lim values
		anagramsToReturn = anagramsToReturn.slice(0, lim);
	}

	var returnVal = {'anagrams': 
									 anagramsToReturn
									};

	res.status(200).json(returnVal);
});

/**
 * Deletes the word passed as a parameter from the corpus.
 */
router.delete('/words/:word.json', function(req, res) {
	lib.deleteWord(req.params.word);
	res.status(200).json();
});

/**
 * Deletes all words from the corpus.
 */
router.delete('/words.json', function(req, res) {
	lib.deleteDictionary();

	res.status(204).json();
});

/**
 * Return a JSON object representing statistics about length of words. Max, Min,
 * Median, Average.
 */
router.get('/statistics', function(req, res) {
	var outVal = {'statistics':{'length': lib.statistics()}};
	res.status(200).json(outVal);
});

/**
 * Deletes a word and all it's anagrams from the corpus.
 */
router.delete('/anagrams/:word.json', function(req, res) {
	lib.deleteAnagrams(req.params.word);
	res.status(204).json();
});

/**
 * Returns true if set of words are all anagrams of each other.  The test will be
 * to find all permutations of the first word, then if *any* the other words are
 * not in the list of permutations => return false.
 */
router.post('/anagrams/words.json', function(req, res) {
	var wordsArr = req.body.words;
	var permutes = lib.permutations(wordsArr[0]);
	var areAnagrams = true;
	for(var word of wordsArr) {
		if(!permutes.includes(word)) {
			areAnagrams = false;
			break;
		}
	}

	var returnVal = {'areAnagrams':areAnagrams};
	res.status(200).json(returnVal);
});

/**
 * Returns a JSON object representing which of the words passed as a list has the
 * greatest number of anagrams in the corpus.
 */
router.post('/anagrams/most.json', function(req, res) {
	var wordsArr = req.body.words;

	var returnVal = lib.mostAnagrams(wordsArr);
	res.status(200).json(returnVal);
});

router.post('/anagrams/min.json', function(req, res) {
	var wordsArr = req.body.words;
	var minLen = req.body.minLen;
	var returnVal = lib.minAnagrams(wordsArr, minLen);

	res.status(200).json(returnVal);
});

module.exports = router;
