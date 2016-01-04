chrome.runtime.onMessage.addListener(notify);

alert("Limpet manager running");

function notify(message) {
    console.log("background script received message");
    chrome.notifications.create({
        "type": "basic",
        "iconUrl": chrome.extension.getURL("link.png"),
        "title": "You clicked a link!",
        "message": message.url
    });
}

function testNotification() {
    chrome.notifications.create({
        'type': 'basic',
        //'iconUrl': chrome.extension.getURL('/img/link.png'),
        'title': 'Limpet notification',
        'message': 'Manager is running'
    });
}

setTimeout(testNotification, 10000);

window.addEventListener('limpet-update-targets', handleUpdateTargetsEvent);

targetList = new Set;

function handleUpdateTargetsEvent(e) {
    targetList = e.detail;
    console.log('updated targets', targetList);
}

window.addEventListener('limpet-ping', handleLimpetPingEvent);

function handleLimpetPingEvent(e) {
    console.info('limpet ping event received');
    sendLimpetPong();
}

function sendLimpetPong(is_running) {
    is_running = is_running || true;
    console.info('sending limpet pong');
    var event = new CustomEvent('limpet-pong',
        {'detail': { 'is_running': is_running, 'targets': targetList}});
    window.dispatchEvent(event);
}

console.info('Limpet Manager running');
