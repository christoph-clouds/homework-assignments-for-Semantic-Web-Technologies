let myMap = new Map();

myMap.set('word', ['file1']);



console.log(myMap.get('word'));

let tempArr = myMap.get('word');

let additionalFile = 'pleasework.txt';

tempArr.push(additionalFile);

console.log(tempArr);

myMap.set('word', tempArr);

myMap.set('worsd', tempArr);



console.log(myMap.size + "size");

myMap.forEach(function(value, key){
    console.log("this is the key" + key);
})


let valueMap = new Map();
valueMap.set('filename', {termfrequency: 1, idf: 123})
myMap.set('search', valueMap);

console.log(myMap.get('search').get('filename').termfrequency + "fuck yeah i love javascript");