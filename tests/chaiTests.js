/**
 * Unit tests implemented in chai.  Intended to be self-documenting.
 */

var chai = require('chai');
var expect = chai.expect;
var lib = require('../library.js');

describe('TEST Ibotta take home project.', function() {
	describe('Test Permutations lib function returns all permutations of param.',
					 function() {
						 var myPerms = ['dare','daer','drae','drea','dear','dera','adre',
														'ader','arde','ared','aedr','aerd','rdae','rdea',
														'rade','raed','reda','read','edar','edra','eadr',
														'eard','erda','erad'];

						 it('All permutations from lib function must be in myPerms list.',
								function() {
									var perms = lib.permutations('dare');
									// Be sure all perms in MyPerms are in lib.permutations
									var permInPerms = true;
									for(var perm of myPerms) {
										// if word is not in darePerms => error
										if(!perms.includes(perm)){
											permInPerms = false;
											break;
										}
									}
									expect(permInPerms).to.be.equal(true);
								});
						 it('All permutations in myPerms list should be returned by lib func',
								function() {
									var perms = lib.permutations('dare');

									// Be sure all returned lib.permutations perms are in myPerms
									var permsInMyPerms = true;
									for(var perm of perms) {
										if(!myPerms.includes(perm)) {
											permsInMyPerms = false;
											break;
										}
									}
									expect(permsInMyPerms).to.be.equal(true);
								});
					 });

	// Test end points
	var chaiHttp = require('chai-http');
	chai.use(chaiHttp);
	describe('Test endpoints.',
					 function(done) {
						 // Test all anagrams for a word
						 it('Should get all anagrams of "read".', function(done) {
							 chai.request('http://localhost:3000')
								 .get('/anagrams/read.json')
								 .end( (err, res) => {
									 expect(err).to.be.null;
									 expect(res).to.have.status(200);
									 var bod = res.body;
									 expect(bod).to.be.a('object');
									 expect(bod).to.have.property('anagrams');
									 var anags = bod.anagrams;
									 expect(anags).to.be.a('array');
									 expect(anags).to.have.lengthOf(4);
									 expect(anags).to.eql(['ared','dear','dare','daer']);

									 done();
								 });
						 });

						 // Test limited anagrams for a word
						 it('Should limit the number of anagrams of "read".',
								function(done) {
									chai.request('http://localhost:3000')
										.get('/anagrams/read.json?limit=2')
										.end( (err, res) => {
											expect(err).to.be.null;
											expect(res).to.have.status(200);
											var bod = res.body;
											expect(bod).to.be.a('object');
											expect(bod).to.have.property('anagrams');
											var anags = bod.anagrams;
											expect(anags).to.be.a('array');
											expect(anags).to.have.lengthOf(2);
											expect(anags).to.eql(['ared','dear']);

											done();
							 });
						 });

						 // Test finding which word has most anagrams from a list
						 it('Should find which word(s) have the most anagrams.',
								function(done) {
									chai.request('http://localhost:3000')
										.post('/anagrams/most.json')
										.send({'words': ['dear','ser','bear']})
										.end( (err, res) => {
											expect(err).to.be.null;
											expect(res).to.have.status(200);
											var bod = res.body;
											expect(bod).to.be.a('object');
											expect(bod).to.have.property('count');
											expect(bod).to.have.property('words');
											var ct = bod.count;
											var wds = bod.words;
											expect(ct).to.be.a('number');
											expect(wds).to.be.a('array');
											expect(ct).to.eql(4);
											expect(wds).to.eql(['dear']);

											done();
											});
								});

						 // Test finding which word has most anagrams from a list
						 it('Should find which word(s) have the most anagrams.',
								function(done) {
									chai.request('http://localhost:3000')
										.post('/anagrams/min.json')
										.send({'words': ['dear','ser','bear'], 'minLen':2})
										.end( (err, res) => {
											expect(err).to.be.null;
											expect(res).to.have.status(200);
											var bod = res.body;
											expect(bod).to.be.a('object');
											expect(bod).to.have.a.property('dear');
											expect(bod).to.have.a.property('bear');
											var dr = bod.dear;
											var br = bod.bear;
											expect(dr).to.be.a('array');
											expect(br).to.be.a('array');
											expect(dr).to.have.lengthOf(4);
											expect(br).to.have.lengthOf(2);

											done();
										});
								});

						 // Test deleting all words from the dictionary
						 it('Should add words to dictionary.',
								function(done) {
									chai.request('http://localhost:3000')
										.post('/words.json')
										.send({'words': ['ser','ter','ber']})
										.end( (err, res) => {
											expect(err).to.be.null;
											expect(res).to.have.status(201);
										});
									chai.request('http://localhost:3000')
										.get('/anagrams/ser.json')
										.end( (err, res) => {
											expect(err).to.be.null;
											expect(res).to.have.status(200);
											var bod = res.body;
											expect(bod).to.be.a('object');
											expect(bod).to.have.property('anagrams');
											var anags = bod.anagrams;
											expect(anags).to.be.a('array');
											expect(anags).to.have.lengthOf(1);
											expect(anags).to.eql(['ers']);

											done();
										});
								});

						 // Test word length statistics for the dictionary
						 it('Should return a set of statistics',
								function(done) {
									chai.request('http://localhost:3000')
										.get('/statistics')
										.end( (err, res) => {
											expect(err).to.be.null;
											expect(res).to.have.status(200);
											var bod = res.body;
											expect(bod).to.be.a('object');
											expect(bod).to.have.property('statistics');
											var stats = bod.statistics;
											expect(stats).to.be.a('object');
											expect(stats).to.have.property('length');
											var length = stats.length;
											expect(length).to.be.a('object');
											expect(length).to.have.a.property('maxLength');
											expect(length).to.have.a.property('minLength');
											expect(length).to.have.a.property('medianLength');
											expect(length).to.have.a.property('averageLength');
											var max = length.maxLength;
											var min = length.minLength;
											var med = length.medianLength;
											var avg = length.averageLength;
											expect(max).to.not.be.NaN;
											expect(min).to.not.be.NaN;
											expect(med).to.not.be.NaN;
											expect(avg).to.not.be.NaN;

											done();
							 });
						 });

						 // Test deleting a single word from the dictionary
						 it('Should delete a word passed as a parameter from the dictionary',
								function(done) {
									chai.request('http://localhost:3000')
										.delete('/words/read.json')
										.end( (err, res) => {
											expect(err).to.be.null;
											expect(res).to.have.status(200);

										});
									chai.request('http://localhost:3000')
										.get('/anagrams/dear.json')
										.end( (err, res) => {
											expect(err).to.be.null;
											expect(res).to.have.status(200);
											var bod = res.body;
											expect(bod).to.be.a('object');
											expect(bod).to.have.property('anagrams');
											var anags = bod.anagrams;
											expect(anags).to.be.a('array');
											expect(anags).to.have.lengthOf(3);
											expect(anags).to.not.include('read');

											done();
										});
								});

						 // Test deleting a single word from the dictionary
						 it('Should delete a word and anagrams passed from the dictionary',
								function(done) {
									chai.request('http://localhost:3000')
										.delete('/anagrams/ser.json')
										.end( (err, res) => {
											expect(err).to.be.null;
											expect(res).to.have.status(204);
										});
									chai.request('http://localhost:3000')
										.get('/anagrams/ser.json')
										.end( (err, res) => {
											expect(err).to.be.null;
											expect(res).to.have.status(200);
											var bod = res.body;
											expect(bod).to.be.a('object');
											expect(bod).to.have.property('anagrams');
											var anags = bod.anagrams;
											expect(anags).to.be.a('array');
											expect(anags).to.be.empty;

											done();
										});
								});

						 // Test deleting all words from the dictionary
						 it('Should delete all words from the dictionary.',
								function(done) {
									chai.request('http://localhost:3000')
										.delete('/words.json')
										.end( (err, res) => {
											expect(err).to.be.null;
											expect(res).to.have.status(204);

										});
									chai.request('http://localhost:3000')
										.get('/anagrams/dear.json')
										.end( (err, res) => {
											expect(err).to.be.null;
											expect(res).to.have.status(200);
											var bod = res.body;
											expect(bod).to.be.a('object');
											expect(bod).to.have.property('anagrams');
											var anags = bod.anagrams;
											expect(anags).to.be.a('array');
											expect(anags).to.be.empty;

											done();
										});
								});

						 // Test deleting all words from the dictionary
						 it('Should return an indication of whether all words co-anagrams.',
								function(done) {
									chai.request('http://localhost:3000')
										.post('/anagrams/words.json')
										.send({'words': ['read','dear','dare'] })
										.end( (err, res) => {
											expect(err).to.be.null;
											expect(res).to.have.status(200);
											var bod = res.body;
											expect(bod).to.be.a('object');
											expect(bod).to.have.a.property('areAnagrams');
											expect(bod.areAnagrams).to.equal(true);
											done();
										});
								});


					 });



	after(function() {
		process.exit();
	});
});
