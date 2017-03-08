chrome.browserAction.onClicked.addListener(function() {
    window.open(chrome.extension.getURL('device.html'), 'iot-device');
});