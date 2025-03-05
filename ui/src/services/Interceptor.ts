const originalFetch = window.fetch;

window.fetch = async (url, options = {}) => {
    const auth = localStorage.getItem('auth');

    if (auth) {
        options.headers = {
            ...options.headers,
            'Authorization': `Basic ${auth}`,
        };
    }

    return originalFetch(url, options);
};
