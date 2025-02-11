document.addEventListener('DOMContentLoaded', () => {
    const proxyHostInput = document.getElementById('proxyHost');
    const proxyPortInput = document.getElementById('proxyPort');
    const connectBtn = document.getElementById('connectBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');
    const statusDiv = document.getElementById('status');

    // Загрузка сохраненных настроек и статуса
    chrome.storage.local.get(['proxyHost', 'proxyPort', 'vpnStatus'], (result) => {
        if (result.proxyHost) {
            proxyHostInput.value = result.proxyHost;
        }
        if (result.proxyPort) {
            proxyPortInput.value = result.proxyPort;
        }
        if (result.vpnStatus) {
            statusDiv.innerText = result.vpnStatus;
            statusDiv.className = result.vpnStatus.toLowerCase();
        }
    });

    connectBtn.addEventListener('click', () => {
        const host = proxyHostInput.value.trim();
        const port = proxyPortInput.value.trim();

        if (host && port) {
            chrome.storage.local.set({ proxyHost: host, proxyPort: port }, () => {
                chrome.runtime.sendMessage({ action: 'connectVPN', host, port }, (response) => {
                    if (response && response.message) {
                        statusDiv.innerText = response.message;
                        statusDiv.className = response.message.toLowerCase().replace(/\s/g, '');
                        chrome.storage.local.set({ vpnStatus: response.message });
                    } else {
                        statusDiv.innerText = 'Неизвестная ошибка. Пожалуйста, попробуйте снова.';
                        statusDiv.className = 'error';
                    }
                });
            });
        } else {
            statusDiv.innerText = '001 - Ошибка ввода данных: Пожалуйста, введите адрес и порт прокси.';
            statusDiv.className = 'error';
        }
    });

    disconnectBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'disconnectVPN' }, (response) => {
            if (response && response.message) {
                statusDiv.innerText = response.message;
                statusDiv.className = response.message.toLowerCase().replace(/\s/g, '');
                chrome.storage.local.set({ vpnStatus: response.message });
            } else {
                statusDiv.innerText = 'Неизвестная ошибка. Пожалуйста, попробуйте снова.';
                statusDiv.className = 'error';
            }
        });
    });
});
