let fs = require("fs");
const pluralize = require('pluralize')
const readline = require('readline');


let dictionary = new Array();

fs.readdirSync('textfiles').forEach(file => {
    processFile(file);
})

console.log(dictionary);


function readfile (filename) {
    return fs.readFileSync(`textfiles/${filename}`, 'utf8');
}

function processFile(filename) {
    let text = readfile(filename).toLowerCase().replace('.', '').replace(',', '').replace('-', ' ');
    let words = text.split(' ').sort();

    for (let j = 0; j < words.length; j++){
        words[j] = pluralize.singular(words[j])
    }




    let entry = {
        name: filename,
        contents: words
    }
    dictionary.push(entry);
}

