
alert('Collector running');

function yellow() {
    document.body.style.background = 'yellow';
    setTimeout(white, 2000);
}

function white() {
    document.body.style.background = 'white';
    setTimeout(yellow, 2000);
}

document.body.style.background = 'yellow';
setTimeout(white, 2000);

console.log('LIMPET: ', document);
console.log('LIMPET: ', window);
console.log('LIMPET: ', this);
