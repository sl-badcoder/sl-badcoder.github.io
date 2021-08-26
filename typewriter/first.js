const quotes = [
    'Test qoute for me'
];

let words = [];
let wordIndex = 0;

let startTime = Date.now()

const quoteElement = document.getElementById('quote')
const messageElement = document.getElementById('message')
const typedValueElement = document.getElementById('typed-value')

document.getElementById('start').addEventListener('click', () => {
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quoets[quoteIndex];

    words = quote.split(' ');
    wordIndex = 0;

    const spanWords = words.map(function(word) {return '<span>${word} </span>'});
    quoteElement.innerHTML = spanWords.join('');

    quoteElement.childNodes[0].className = 'highlight';
    messageElement.innerText = '';

    typedValueElement.value = '';

    typedValueElement.focus();

    startTime = new Date().getTime();

});

typedValueElement.addEventListener('input', () =>{
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    if(typedValue === currentWord && wordIndex === words.length - 1){

        const elapsedTime = new Date().getTime() -startTime;
        const message = 'YOU FINISHED IN ${elapsedTime / 1000} SECONDS.'
        messageElement.innerText = message;

    }else if(typedValue.endsWith(' ') && typedValue.trim() === currentWord){
        typedValueElement.value = '';

        wordIndex++;
        for(const wordElement of quoteElement.childNodes){
            wordElement.className = '';
        }
        quoteElement.childNodes[wordIndex].className = 'highlight';


    }else if(currentWord.startsWith(typedValue)){
        typedValueElement.className = '';
    }else {
        typedValueElement.className = 'error';
    }




});
