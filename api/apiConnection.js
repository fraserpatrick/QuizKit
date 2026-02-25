const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL ? process.env.EXPO_PUBLIC_API_BASE_URL + 'public' : '';

export const apiFetch = async (endPoint, method = "GET", body = null, params = {}, isFormData = false) => {
    try {
        let url = `${baseURL}/${endPoint}`;

        if (Object.keys(params).length) {
            const query = new URLSearchParams(params).toString();
            url += `?${query}`;
        };

        const options = {
            method,
            headers: {},
        };

        if (!isFormData) {
            options.headers["Content-Type"] = "application/json";
        }

        if (body){
            options.body = isFormData ? body : JSON.stringify(body);
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        };

        return await response.json();
    }
    catch (error) {
        console.error("API error", error);
        throw error;
    }
};