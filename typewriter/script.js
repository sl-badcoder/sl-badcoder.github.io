const quotes = [
    'A life portfolio offers a compelling alternative to traditional retirement. It is a new way of thinking and living in extended middle age. A typical portfolio is a balanced mix of some work, ongoing learning, recreation, travel and avocations, reconnecting with family and friends, and giving back.',
    'We have three roles here on earth: to learn, to love, and to live. When we stop learning, we start to stagnate and die. When we stop loving, we lose our sense of purpose and become self-centered. When we limit our living, we deny the world the benefits of our talents.',
    'Simplicity requires a two-step process. First, we must invest time and energy to discover what stirs us as human beings, what makes our hearts sing, and what brings us joy. Then, we must proceed to create the life that reflects the unique people we truly are. This is the heart and soul of simplicity.',
    'Taking responsibility - practicing 100 percent responsibility every day - is about seeing ourselves not as right or wrong, but as an agent, chooser, problem solver, and learner in the complex interrelationships of our lives so that we can better integrate with the people and world around us. When we do this, we enjoy a better and more productive way to live and lead.',
    'Most of those who have succeeded in life can trace their success back to the essential education they obtained from parents, teachers and/ or friends.',
    'The foundation stones of honesty, character, faith, integrity, love, and loyalty are necessary for a balanced success that includes health, wealth, and happiness. As you go onward and upward in life, you will discover that if you compromise any of these principles you will end up with only a beggars portion of what life has to offer.',


];

let words = [];
let wordIndex = 0;

let startTime = Date.now()

const quoteElement = document.getElementById('quote')
const messageElement = document.getElementById('message')
const typedValueElement = document.getElementById('typed-value')

document.getElementById('start').addEventListener('click', () => {
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];

    words = quote.split(' ');
    wordIndex = 0;
    
    const spanWords = words.map(function(word, wordIndex, words) {
    if(wordIndex < words.length - 1){
        return `<span>${word} </span>`
    }else{
        return `<span>${word}</span>`
    }
    });
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

        quoteElement.childNodes[wordIndex].className = '';
        typedValueElement.value = '';
        const elapsedTime = new Date().getTime() - startTime;
        console.log(elapsedTime);
        const message = `YOU FINISHED IN ${elapsedTime / 1000} SECONDS.`
        messageElement.innerText = message;

    }else if(typedValue.endsWith(' ') && typedValue.trim() === currentWord){
        typedValueElement.value = '';

        wordIndex++;

        quoteElement.childNodes[wordIndex - 1].className = '';
        quoteElement.childNodes[wordIndex].className = 'highlight';


    }else if(currentWord.startsWith(typedValue)){
        typedValueElement.className = '';
    }else {
        typedValueElement.className = 'error';
    }
});
