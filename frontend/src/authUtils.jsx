// custom fetch to revalidate jwts

export const fetchWithRetry = async (url, options) => {
    try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
            const response = await fetch(url, {
                ...options,
                headers: headers,
            });

            // response status is not 401, return response directly
            if (response.status !== 401) {
                return response;
            }

            // response status is 401, attempt to refresh the token
            const refreshResponse = await fetch('http://127.0.0.1:5000/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh_token: localStorage.getItem('refresh_token'),
                    session_id: localStorage.getItem('session_id')
                })
            });

            if (refreshResponse.ok) {
                const refreshedToken = await refreshResponse.json();
                localStorage.setItem('jwtToken', refreshedToken.access_token);
                
                const retryResponse = await fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Authorization': `Bearer ${refreshedToken.access_token}`,
                    }
                });

                return retryResponse;
            } else {
                console.error('Error refreshing token:', refreshResponse.statusText);
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('session_id');
            }
        } else {
            console.log('No JWT token found. Logging out.');
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('session_id');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};