'use strict';

function updateIcon(img, blob) {
    img.width = '32';
    img.height = '32';
    img.src = window.URL.createObjectURL(blob);
}

function appIconImg(app) {
    var img = new Image();
    navigator.mozApps.mgmt.getIcon(app, 128)
        .then(updateIcon.bind(this, img))
        .catch(console.error);
    var div = document.createElement('div');
    div.className = 'app_icon';
    div.appendChild(img);
    return div;
}

var monitoredApps = new Set;

function notifyLimpet(targets) {
    console.info("Informing Limpet of new target list: ", targets);
    var event = new CustomEvent('limpet-update-targets',
        {'detail': targets});
    window.dispatchEvent(event);
}

function pingLimpet() {
    console.info('Pinging Limpet Add-on...');
    window.dispatchEvent(new CustomEvent('limpet-ping'));
}

function setLimpetStatusActive() {
    var status = document.getElementById('limpet_status');
    status.textContent = 'active';
    status.className = 'limpet_status_active';
}

function setLimpetStatusInactive() {
    var status = document.getElementById('limpet_status');
    status.textContent = 'inactive';
    status.className = 'limpet_status_inactive';
}

function updateLimpetStatus(e) {
    if (e.detail.is_running) {
        setLimpetStatusActive();
    } else {
        setLimpetStatusInactive();
    }

}

function handleInputChange(e) {
    console.log(e);
    var origin = e.target.value;
    if (e.target.checked) {
        monitoredApps.add(origin);
        console.log("adding", origin);
    } else {
        monitoredApps.delete(origin);
        console.log("removing", origin);
    }
    notifyLimpet(monitoredApps);
}

function appAsListItem(app) {
    console.info(app);

    var name = app.manifest.name || 'unknown name';
    var origin = app.origin + '/*' || 'unknown origin';

    var nameDiv = document.createElement('div');
    nameDiv.className = 'app_list_name';
    nameDiv.textContent = name;

    var input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'app_list_checkbox'
    input.value = origin;
    input.addEventListener('change', handleInputChange);

    var div = document.createElement('div');
    div.className = 'app_list_div';
    div.appendChild(appIconImg(app));
    div.appendChild(nameDiv);
    div.appendChild(input);

    return div;
}

function appsAsList(apps) {
    var div = document.createElement('div');
    for (var i of apps.map(appAsListItem)) {
        div.appendChild(i);
    }
    return div;
}

function renderList(dst, apps) {
    while (dst.firstChild) {
        dst.removeChild(dst.firstChild);
    }
    dst.appendChild(appsAsList(apps));
}

function renderAppList(dst) {
    window.navigator.mozApps.mgmt.getAll()
        .then(renderList.bind(this, dst))
        .catch(console.error);
}

function start() {
    var appList = document.getElementById('app_list');
    appList.textContent = "Searching for apps...";
    renderAppList(appList);
    setLimpetStatusInactive();
    window.addEventListener('limpet-pong', updateLimpetStatus);
    pingLimpet();
}

window.addEventListener('DOMContentLoaded', startApp.bind(this));

var translate;

function startApp() {
    translate = navigator.mozL10n.get;
    navigator.mozL10n.once(start);
}

console.info("Limpet Controller running");

