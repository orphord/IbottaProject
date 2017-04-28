"use strict";

const fileLoc = __dirname + '/data/dictionary.txt';
//const fileLoc = __dirname + '/data/nada.txt'; // to test dictionary validity
//const fileLoc = __dirname + '/data/headDict.txt'; // used for prototyping
//const fileLoc = __dirname + '/data/YourMom.txt'; // used to test missing file

const JFile = require('jfile');
const infile = new JFile(fileLoc);

var dict = {};

/**
 * Initialization function to be executed at system startup.
 * Precondition: Node starts properly
 * Postcondition: an associative array is populated (dict) with the list of words
 *   from the dictionary.txt file with both the key and value being a single word
 */
module.exports.initDictionary = function() {
    console.log('Init function called.');
	
    // Open dictionary.txt file in data/ and read contents into assoc array
    try {
	infile.lines.forEach( (line) => 
			      { 
				  if(line !== '')
				      dict[line.toLowerCase()] = line;
			      } );
    } catch(ex) {
	console.log('An error occurred trying to get data from dictionary file.');
	console.log(ex.toString());
    }
	
}

/**
 * Function to return the list of anagrams of the passed in string that exists in
 * the dictionary corpus.
 * Precondition: a string passed in as a parameter
 * Postcondition: an array of strings of the anagrams of the string passed as a
 *   parameter that exist in the dictionary corpus (not including word itself).
 */
function anagrams(word, inclProper) {
    // Validate dictionary exists
    if(!dictIsValid()) {
	throw "Dictionary is not valid!";
    }

    console.log('anagrams function called: ', word);

    var permutationsOfWord = permute(word).slice(1); // don't include word itself
    var outVal = [];
    var i = 0;
    for(var permutation of permutationsOfWord) {
	var dictWord = dict[permutation.toLowerCase()];

	// Handle proper noun values here
	if(typeof dictWord !== 'undefined' && dictWord !== null) {
	    if(inclProper) {
		// This may or may not be a capitalized word
		outVal.push(dictWord);
	    } else if(dictWord.charAt(0) !== dictWord.toUpperCase().charAt(0)) {
		// This is not a capitalized word
		outVal.push(dictWord);
	    }
	}
    }

    return outVal;
}
module.exports.anagrams = anagrams;

/**
 * Function to delete full corpus.
 */
module.exports.deleteDictionary = function() {
    console.log('deleteDictionary function called.');
    dict = {};
    module.exports.dictionary = dict;
}

/**
 * Function to delete a word from the corpus.
 */
function deleteWord(aWord) {
    console.log('deleteWord function called: ', aWord);
    delete dict[aWord];
}
module.exports.deleteWord = deleteWord;

/**
 * Function to delete a word and its anagrams from the corpus.
 * Precondition: a word is passed in as a parameter
 * Postcondition: the 
 */
module.exports.deleteAnagrams = function(aWord) {
    console.log('deleteAnagrams function called: ', aWord);	
    var permutes = permute(aWord);
    permutes.forEach(deleteWord);
}

/**
 * Permutation string returning function.  Returns a list of the permuted strings
 * of the string passed in.
 * Precondition: a string passed in as a parameter
 * Postcondition: an array of strings of the permutations of that parameter NOT
 * including the word itself.
 * (eg. if param is 'cat' => permutation list would be ['cat', 'cta','act','atc',
 *  'tac','tca'])
 * For a string of n characters one would expect n! permutations in the returned
 * list.
 */
function permute(toPermute) {
    // Recursion break condition
    if (toPermute.length < 2)
	return toPermute;

    var outVal = []; // This array will hold the permutations

    for (var i=0; i< toPermute.length; i++) {
	var char = toPermute[i];

    // Cause we don't want any duplicates:
    if (toPermute.indexOf(char) != i) // if char was used already
	continue;           // skip it this time

	var remainingString = toPermute.slice(0,i) 
	    + toPermute.slice(i + 1, toPermute.length);

	for (var subPermutation of permute(remainingString))
	    outVal.push(char + subPermutation);
    }

    return outVal;
}
module.exports.permutations = permute;

/**
 * Function to return Min, Max, Median, Average length of words currently in
 * dictionary as an object with fields representing each.
 * Precondition: the corpus has been initialized.
 * Postcondition: the following statistics of word lengths have been calculated:
 *   maximum word length, minimum word length, median word length (half of words
 *   are longer and half are shorter), average word length (arithmetic average of
 *   word lengths).
 */
module.exports.statistics = function() {
    var outVal = {
	'maxLength': longest(),
	'minLength': shortest(),
	'medianLength': medianLen(),
	'averageLength': averageLen()

    };

    return outVal;
}

module.exports.dictionary = dict;
module.exports.filelocation = fileLoc;

/**
 * Function to return a JSON object representing the number of anagrams of the
 * word or words passed as a list parameter with the most anagrams.
 * Precondition: An array of words is passed to determine which word or words has
 *   the most anagrams.
 * Postcondition: A JSON object is returned with the count of the most anagrams
 *   and a list of those words with that count.
 */
module.exports.mostAnagrams = function(wordList) {
    console.log('mostAnagrams function called.');
    var most = {'count':0, 'words':[]};
    for(var word of wordList) {
	var thisCount = anagrams(word, true).length;

	if(thisCount > most.count) {
	    // Create new words list with single value
	    var words = [word];
	    most.count = thisCount;
	    most.words = words;

	} else if (thisCount === most.count) {
	    // Add word to words list
	    most.words.push(word);
	}
    }

    return most;
}

/**
 * Function to return a JSON object representing the words and their anagrams
 * for those words in the wordsList parameter with anagrams greater than or
 * equal to the minLength parameter.
 */
module.exports.minAnagrams = function(wordList, minLength) {
    console.log('minAnagrams function called.');
    var anagramObj = {};
    for(var word of wordList) {
	var anagramList = anagrams(word, true);

	// If the length of the anagram list is >= minLength add it to the object
	// to be returned
	if(anagramList.length >= minLength) {
	    anagramObj[word] = anagramList;
	}
    }

    return anagramObj;
}

/**
 * Function to return the longest word length in the dictionary.
 */
function longest() {
    // Validate dictionary exists
    if(!dictIsValid()) {
	throw "Dictionary is not valid!";
    }

    // find longest length word
    return Object.values(dict).reduce(function(a, b) {
	return a.length > b.length ? a : b;
    }).length;

}

/**
 * Function to return the shortest word length in the dictionary.
 */
function shortest() {
    // Validate dictionary exists
    if(!dictIsValid()) {
	throw "Dictionary is not valid!";
    }
    // find shortest length word
    return Object.values(dict).reduce(function(a, b) {
	return a.length < b.length ? a : b;
    }).length;

}

/**
 * Function to return the length of the word where half of the word lengths are
 * shorter and half of the word lengths are longer. In the case of an even number
 * of words => the average length of the middle two words will be returned. So,
 * if the word lengths was [10, 5, 4, 2] => 4.5 would be returned.
 */
function medianLen() {
    // Validate dictionary exists
    if(!dictIsValid()) {
	throw "Dictionary is not valid!";
    }

    // Sort array by length
    var dictArray = Object.values(dict);
    dictArray.sort(function(a, b) {
	return a.length - b.length;
    });

    // Find middle value
    var middle = Math.floor((dictArray.length) / 2);
    var median = dictArray[middle].length;
    if(dictArray.length % 2 === 0) {
	median = (dictArray[middle].length + dictArray[middle +1].length) / 2.0;
    }

    return median;
}

/**
 * Function to return the average length of the words in the dictionary.  The
 * value returned will be rounded to the .0000 spot.
 */
function averageLen() {
    // Validate dictionary exists
    if(!dictIsValid()) {
	throw "Dictionary is not valid!";
    }

    // Attempt to use reduce() function
    //	console.log('Reduce call: ', Object.values(dict).reduce( (sum, val) =>
    //                                                    sum + val.length), 0);

    // Sum Lengths of all words in corpus
    var sum = 0;
    var dictVals = Object.values(dict);
    Object.values(dict).forEach( (val) => {
	sum += val.length;
    });

    // calculate average word length
    var avg = sum / dictVals.length;

    // Round to nearest .0000 spot
    avg += 0.00005;
    avg = avg.toFixed(4);

    return avg;
}


/**
 * Validates dictionary state.  If dictionary is not initialized properly an
 * error will be raised.
 */
function dictIsValid() {
    console.log('dictIsValid() function called.');
    let outVal = true;
    if(dict === null || dict === 'undefined' 
       || Object.keys(dict).length === undefined) {
	console.log('DICT', Object.keys(dict).length);
	outVal = false;

    } else {
	console.log('DICT.length', Object.keys(dict).length);
    }

    return outVal;
}
