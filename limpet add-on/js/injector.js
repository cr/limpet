

// Bail out as quickly as possible if not
// running inside an injection target.
var targets = new Set(['app://clock.gaiamobile.org/index.html']);
if (!targets.has(document.location.href)) {
    return;
}

// Prevent multiple instances
if (document.documentElement.dataset.injectorAttached) {
    console.error('Limpet already attached to ' + document.location.href);
    return;
}
document.documentElement.dataset.injectorAttached = true;

function injectCollectorScript() {

    function testNotification() {
        chrome.notifications.create({
            'type': 'basic',
            'iconUrl': chrome.extension.getURL('/img/link.png'),
            'title': 'Limpet notification',
            'message': 'Manager is running'
        });
        setTimeout(testNotification, 10000);
    }
    setTimeout(testNotification, 10000);

    //console.error('oooh');
    //var collector = window.wrappedJSObject.document.createElement('script');
    var collector = document.createElement('script');
    collector.setAttribute('type', 'text/javascript');
    collector.setAttribute('id', 'limpet-collector');
    //collector.setAttribute('src', chrome.extension.getURL('/js/collector.js'));
    //collector.setAttribute('src', 'js/collector.js');
    var jsText = document.createTextNode('alert("in like flynn");console.error("flynn is in");');
    collector.appendChild(jsText);
    //window.wrappedJSObject.document.getElementsByTagName('head')[0].appendChild(collector);
    //window.wrappedJSObject.document.head.appendChild(collector);
    //window.document.head.appendChild(collector);
    document.body.appendChild(collector);
    console.info("script: ", collector);

    console.info('Collector injected intooOOOooooo ' + document.location.href);
    console.info('window: ', window);
    console.info('wrappedJSObject: ', window.wrappedJSObject);
    wrap(window.wrappedJSObject.navigator.mozAlarms, 'add');
    wrap(window.wrappedJSObject, 'addEventListener');
    window.wrappedJSObject.foo = function () {console.info('foo')};
    window.foob = function () {console.info('foob')};
//    var uw = XPCNativeWrapper.unwrap()
    console.info("Components: ", Components);
    console.log("chrome: ", chrome);
    console.log("browser: ", browser);
    console.log("navigator: ", navigator);

    try {
        browser.tabs.executeScript(null, {
            file: "js/collector.js"
        });
    } catch(e) {
        console.log(e);
    }

    console.info('done');
}

function logWrapp(fn) {
    var wrapped = function() {
        console.log('logging call ', this, arguments);
        return this.__fn.apply(this.__fn, arguments);
    };
    wrapped.__fn = fn;
    return wrapped.bind(wrapped);
}

function logWrap(fn) {
    var wrapped = function() {
        console.log('logging call ', this, arguments);
        return fn.apply(fn, arguments);
    };
    return wrapped;
}

function doLogging(object, property, args, e) {
    console.log(object, property, args, e.fileName, e.lineNumber, e.stack);
}

function wrap(object, property) {
    var original = object[property];
    object[property] = function() {
        doLogging(object, property, arguments, new Error);
        return original.apply(this, arguments);
    };
    // CAVE: may cause problems if wrapped object
    // contains __restore__ property
    object[property].__restore__ = function() {
        object[property] = original;
    };
    return original;
}

// If necessary, wait for DOM to load.
if (document.documentElement) {
    injectCollectorScript();
} else {
    window.addEventListener('DOMContentLoaded', injectCollectorScript);
}

function messageHandler(msg) {
    console.log('Injector received message: ', msg);
}
chrome.runtime.onMessage.addListener(messageHandler);
