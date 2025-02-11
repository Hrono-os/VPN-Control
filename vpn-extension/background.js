chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'connectVPN') {
        const proxyConfig = {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "socks5", // Используем SOCKS5
                    host: message.host, // Адрес вашего SOCKS прокси
                    port: parseInt(message.port) // Порт вашего SOCKS прокси
                },
                bypassList: ["localhost"]
            }
        };

        chrome.proxy.settings.set({ value: proxyConfig, scope: 'regular' }, () => {
            if (chrome.runtime.lastError) {
                sendResponse({ message: 'Ошибка подключения: ' + chrome.runtime.lastError.message });
            } else {
                sendResponse({ message: 'VPN подключен успешно' });
            }
        });
        return true; // Указывает, что ответ будет отправлен асинхронно
    } else if (message.action === 'disconnectVPN') {
        chrome.proxy.settings.set({ value: { mode: "direct" }, scope: 'regular' }, () => {
            if (chrome.runtime.lastError) {
                sendResponse({ message: 'Ошибка отключения: ' + chrome.runtime.lastError.message });
            } else {
                sendResponse({ message: 'VPN отключен' });
            }
        });
        return true; // Указывает, что ответ будет отправлен асинхронно
    }
});
