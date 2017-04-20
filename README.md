Dev Project Notes
=========

# Initial Note
This project was written in Node.js which -- while I do have experience with it -- I would not consider my strongest language.  I really look forward to others' ideas about how I might have done this better or if there are standards unknown to me.  
The decision to use Node.js was based on two ideas,
  a) I wanted to take this opportunity to learn more and
  b) it is a good tool for doing the RESTful web APIs such as were required for this effort.

Start the server at the command line type 'npm start' in the root directory of the project.  To run the chai tests (see Testing section below) after starting server, in a separate terminal window in the root directory of the project type 'npm test'.

#Requirements
The fundamental purpose of this project was to provide a number of endpoints
related to anagrams of words in a large dictionary of words.
* Add words to dictionary.
* Get the set of anagrams for a word passed as a parameter from the dictionary
- optionally limit the number of anagrams returned with a parameter
- optionally include proper nouns which are excluded by default
* Delete a single word from dictionary
* Delete the contents of the dictionary
* Get a set of statistical information about the length of words in the dictionary
* Given a list of words return an indication of whether they are anagrams of each other.
* Given a list of words return the greatest number of anagrams among them and those words from the paramter list that have that number of anagrams
* Given a list of words and a parameter indicating a minimum number of anagrams, return the list of anagrams associated with each parameter word *with* that minimum (or greater) number of anagrams

## Initialization
A file named dictionary.txt wis read into the "corpus" which is the set of words in memory.

## More technical description of implemented endpoints
### Required as MVP
* `POST /words.json` endpoint takes a JSON array of English-language words and adds them to the corpus (data store).
- This endpoint receives an array of words and adds them to the in-memory corpus.  The words will not be persisted in the dictionary.txt file.
- An example request would be `curl -i -X POST -d '{ "words": ["read", "dear", "dare"] }'`
- The only return value is the http status of 201 indicating that the words were successfully added to the corpus.
* `GET /anagrams/:word.json[?limit=n&inclProper=y]`:
- Returns a JSON array of English-language words that are anagrams of the word passed in the URL.
- Supports an optional query param (limit=n where 'n' is some number) that indicates the maximum number of results to return.
- Also supports an optional query param (inclProper=y will include proper nouns) that indicates whether or not to include proper nouns.  The default is to *not* include proper nouns.
* `DELETE /words/:word.json`: Deletes a single word from the data store.
- Note: this will *not* delete the word from the persistent data store (dictionary.txt file)
- The only return value is the http status of 200 indicating the word was successfully deleted from the corpus.
* `DELETE /words.json`: Deletes all contents of the data store.
- Note: this will *not* delete the words from the persistent data store (dictionary.txt file)
- The only return value is the http status of 204 indicating there is no content to select from in the corpus.

### Optional endpoints Implemented
* `GET /statistics` endpoint that returns a count of words in the corpus and min/max/median/average word length
- A JSON object is returned with maxLength, minLength, medianLength, and averageLength fields.
- example test request `http://localhost:3000/statistics`
* `POST /anagrams/words.json` endpoint that takes a set of words and returns whether or not they are all anagrams of each other
- A JSON object will be returned indicating 'true' if all words in the parameter list or 'false' if not
- example test request: `curl -i --header "Content-Type: application/json" -X POST -d '{ "words": ["read", "dear", "dare"] }' http://localhost:3000/anagrams/words.json`
* `POST /anagrams/most.json` endpoint takes a JSON array of English-language words and finds which of them has the most anagrams.
- A JSON object will be returned indicating the count of the anagrams of the word(s) from the parameter list with a list of the words that have that number of anagrams.
- example test request: `curl -i --header "Content-Type: application/json" -X POST -d '{ "words": ["dare","read"] }' http://localhost:3000/anagrams/most.json`
* `POST /anagrams/min.json` endpoint takes a JSON array of English-language words and a parameter indicating the minimum number of anagrams to be returned.
- A JSON object will be returned with each word for which there are a minimum of 'minLength' anagrams and an array of strings with those anagrams.
- example test request: `curl -i --header "Content-Type: application/json" -X POST -d '{ "words": ["read", "dear", "dare"],"minLen":3 }' http://localhost:3000/anagrams/min.json`

# Code Organization
## Entry point
The app.js file is the entry point to the system
* First, app.js declares some variables to be used in implementing the system
- For example, the express module is a commonly used framework to enable easy implementation of web-based apps and APIs
* Next, the library function initDictionary() is called to read words from the dictionary.txt file into the corpus object.
* app.js then declares some middleware (for example "body-parser" which allows POST params to be accessed in the application)
* Finally, the http server is initialized to listen on port 3000.

## Routes
The routes.js file is referred to in the variable declarations of app.js.  It is used to define the http endpoints defined in this system.
* Each of the endpoints in the Requirements section above is defined here.  Each route responds to a type of http request (eg. GET, POST, DELETE).
- These are part of the express package's router object referred to in routes.js
* The routes do basic tasks to accept and format the input
- **Note: this is where I would validate input supplied by users in a production application**

## Library
The library.js file is referred to in the variable declarations in both app.js and routes.js.  It is where much of the "heavy lifting" is done to implement the requirements of the project such as:
* permutations -- given a string, recursively call this function with substrings returning permutations of the order of the characters in the string.
* initDictionary -- read the full dictionary.txt into a key-value Javascript object where the key and value are both the word from dictionary.txt.
- using a key-value object allowed for much quicker access to the words in the dictionary with the standard time vs. memory trade-offs being made.  The original write-up of the project indicated that memory should not be considered a constraint.
* anagrams -- given a string, return the set of anagrams from the corpus.
- step 1. is to find permutations of the word parameter
- step 2. is to loop thru these permutations and push those that exist in the corpus to the list to be returned.
* statistics -- return a JSON object with some statistical information about the corpus as follows:
- maxLength - the maximum word length in the corpus.
- minLength - the minimum word length in the corpus.
- medianLength - the length of word where half of the words have a longer length and half have a shorter length.
- averageLength - the arithmetic average length of the words in the corpus.

# Testing
In order to learn a bit about unit testing Node.js, I implemented a set of tests in the 'tests/' directory under the root directory of the project.  These are implemented using the mocha testing framework and the chai assertion library.

# Potential enhancements
If any of this is useful I could imagine that the ability to know if a reversed word is in the corpus might be useful. :-)  This might be somehhing like the following endpoint:
* `GET /anagrams/isReversedAWord/:word.json` which would return a JSON object indicating the reversed word and 'true' if it exists in the corpus and 'false' if not.

I could imagine an enhancement to pass a 'lowmemory' parameter when starting the server which would make different tradeoff choices than this implementation makes where memory was considered unconstrained.  The result of this would likely be a longer response time and certainly a more complex source code base.

I've noticed the statistics endpoint to be fairly low performing.  If better performance was deemed to be a requirement, I could imagine making the code a bit more complex to calculate and store statistics as the dictionary changed (eg. at initialization and when words are added or deleted).  However, if the performance of the endpoint is sufficient as it is I think simplicity and readability would suffer for this enhancement.

# Limitations
The implementation provided does not have any designed limitations.  As a practical matter the size of the corpus is limited by available memory as well as the length of the word parameter when attempting to find its set of anagrams.  

A word parameter of n characters would have n! (factorial) words of the same length, the design decision to store this set in memory was made for simplicity of implementation reasons and *could* be changed, but the tradeoff would be more complex source code implementation as well as potentially somewhat slower response.

# Note
As an exercise I've created a Dockerfile to containerize this app.  If you're interested in running it this way the following steps worked for me:
* In the root directory of the project type 'docker build -t jefforford/ibotta-dev-app .'
- This will take a time to build the container
* Then 'docker run -p 3001:3000 -d jefforford/ibotta-dev-app'
* Port 3001 will respond to requests thru the containerized version of the app, for example in a browser "http://localhost:3001/anagrams/read.json"
