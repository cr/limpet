document.body.style.border = '2px solid red';

// Prevent multiple instances
if (document.documentElement.dataset.systemProxyAttached) {
    console.error('Limpet already attached to ' + document.location.href);
    return;
}
document.documentElement.dataset.systemProxyAttached = true;

// If necessary, wait for DOM to load.
if (document.documentElement) {
    init();
} else {
    window.addEventListener('DOMContentLoaded', init);
}

function init() {
    chrome.runtime.onMessage.addListener(messageHandler);
}

function messageHandler(msg) {
    console.log('System message handler received message: ', msg);
}
