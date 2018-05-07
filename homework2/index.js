const read = require('read-file');
const testFolder = 'corpus';
const fs = require('fs');
const readlineSync = require('readline-sync');
const sw = require('stopword');
//const stemmer = require('stemmer');

//siehe Zeile 79 -> Verbesserung (seit der letzten Vorlesung)
//HINT FÜR AUFGABE 2: Array muss ausgetauscht werden in Map oder Object (man kann über das Array nicht iterieren, da die Indizes Wörter sind) => also Datenstruktur ändern für HÜ 2

let dictionary = new Map();
let totalFiles = 0;

fs.readdir(testFolder, (err, files) => { //preprocessing the files
    files.forEach(file => { // loops over every file in resources
    totalFiles += 1;

    let plaintext = readFileFromPath(`${testFolder}/${file}`); //reads the input of the txt-file
    let wordsInText = extractWords(plaintext); //extracts all words into an array of words
    buildIndex(wordsInText, file); //builds the dictionary
});

createConsole(); //interaction with user - creates text and computes answer

function createConsole(){
    const answer = readlineSync.question('Enter query, empty to quit: '); //creates text and waits for input
    let keywords = sw.removeStopwords(answer.split(" ")); //keywords = user input in array (words) without stopwords
    keywords = keywords.map(x => x.toLowerCase()); // //lowercases every word

    if (answer === ""){
        console.log("exiting program...");
        console.log()
    }
    else{
        let results = new Map();

        for (let word of keywords) { // for each keyword in the query do the following
            if (dictionary.has(word)){ // if the dictionary contains a entry of the keyword
                let findings = dictionary.get(word); //get all the entries about that keyword (filenames and term frequencies)

                findings.forEach(function(value, key){ //for each of those entries do the following, using key and value of the entry
                    if(!results.has(key)){  //if the file is not yet in results do this
                        let score = new Map();

                        let tfidfScore = value * (totalFiles / results.size);

                        score.set(word, tfidfScore);

                        score.set(1, tfidfScore); //use something else than a string as key for the total score

                        results.set(key,score);
                    }
                    else if(results.has(key)){ //if the file is already in results do this
                        let score = results.get(key);

                        let tfidfScore = value * (totalFiles / results.size);

                        let totalScore = score.get(1) + tfidfScore;

                        score.set(word, tfidfScore);

                        score.set(1, totalScore);

                        results.set(key, score);
                    }
                })
            }
            else{
                console.log("word ${word} not found in dictionary");
            }
        }

        let resultsSorted = new Array();

        results.forEach(function(value,key){
            resultsSorted.push({filename: key, score: value.get(1)})
        })

        resultsSorted.sort(function(a,b){
            if(a.score > b.score){
                return -1;
            }
            if(a.score < b.score){
                return 1;
            }
            return 0;
        })

        for (let i = 0; i < 5; i++){
            console.log("result rank "+ (i+1) +": " + resultsSorted[i].filename + "    score:" + resultsSorted[i].score);
            results.get(resultsSorted[i].filename).forEach(function(value, key){

                if(typeof key == "string"){
                    console.log("per-term score for " + key + ": " + value);
                }
            })
            console.log();
        }
        createConsole();
    }

    /*
    if (keywords.length < 2){ //only one keyword to process

        console.log(getResourceOfOneKeyword(keywords[0])); //gets the filenames of the files containing the entered keywords
        console.log();
        createConsole(); //keep asking for more queries
    }
    else{ //input contains more than one keyword -> boolean AND
        const arrayWithAllKeywordResources = new Array();
        for (let keyword of keywords){
            arrayWithAllKeywordResources.push(getResourceOfOneKeyword(keyword)); //creates array that holds arrays of the filenames of a keyword
        }
        let results = arrayWithAllKeywordResources[0]; //save all the filenames (containing the keyword #1) of the first keyword
        for (let i = 1; i < arrayWithAllKeywordResources.length; i++){ //loops over every keyword's array of filenames
            results = getCommonArrayItems(results, arrayWithAllKeywordResources[i]); //compares two arrays and returns their common entries
        }
        console.log(results);
        console.log();
        createConsole(); //keep asking for more queries
    }
    */
}
})


function getResourceOfOneKeyword(keyword){
    if (dictionary[keyword] == null){ //if the keyword is NOT in the inverted index
        return new Array(); //return empy array
    }
    else { //if the keyword is in the inverted index, return array of filenames that contain that word
        return dictionary[keyword];
    }
}

function readFileFromPath(filename){
    return read.sync(filename, 'utf8');
}

function extractWords(input){
    let text =  input.replace("-", " ").split(" "); //splits the words when a " " blank char appears
    for (let i = 0; i < text.length; i++){ //loop over every word in text
        text[i] = text[i].replace(".", "").replace("\n", "").replace(",","").toLowerCase(); //removes special characters in the words
    }
    text = sw.removeStopwords(text); //removes stopwords -> array now only contains non-stopwords
    return text;
}

function buildIndex(words, file){
    for (let word of words){ //loop over every word
        if (!dictionary.has(word)){ //if the word is NOT already in the index

            let termFrequencies = new Map();

            termFrequencies.set(file, 1);

            dictionary.set(word, termFrequencies); //add an array (containing the filename in position 0) to the position of the certain word
        }
        else if(dictionary.get(word).has(file)){

            let termFrequencies = dictionary.get(word).get(file);

            termFrequencies += 1;

            dictionary.get(word).set(file, termFrequencies);

        }
        else{
            dictionary.get(word).set(file, 1);
        }
    }
}

function getCommonArrayItems(results, currentItem){
    let temp = results.filter((item) =>{ //loops over every entry in results
        return currentItem.includes(item); //if the current filename of results is also in the other array -> save in temp
})
    return temp; //temp will be new results array the next time the function is calleds
}
