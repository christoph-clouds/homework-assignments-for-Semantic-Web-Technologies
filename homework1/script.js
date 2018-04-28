let fs = require("fs");
var pluralize = require('pluralize')



let files = [];

for(let i = 1; i <= 3; i++){
    let content = processFile(i);
    files.push(content);
}

let vocabulary = 


console.log (files);



function readfile (filename) {
    return fs.readFileSync(`textfiles/${filename}.txt`, 'utf8');
}

function processFile(filename) {
    let text = readfile(filename).toLowerCase().replace('.', '').replace(',', '').replace('-', ' ');
    let words = text.split(' ').sort();

    for (let j = 0; j < words.length; j++){
        words[j] = pluralize.singular(words[j])
    }

    let file = {
        name: filename,
        contents: words
    }
    return file;
}

