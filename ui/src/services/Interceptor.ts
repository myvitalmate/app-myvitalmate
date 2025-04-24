const originalFetch = window.fetch;

window.fetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        };
    }
    return originalFetch(url, options);
};
