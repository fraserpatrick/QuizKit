const baseURL = "https://devweb2025.cis.strath.ac.uk/~nxb22128/QuizKit_Backend/public";

export const apiFetch = async (endPoint, method = "GET", body = null, params = {}) => {
    try {
        let url = `${baseURL}/${endPoint}`;

        if (Object.keys(params).length) {
            const query = new URLSearchParams(params).toString();
            url += `?${query}`;
        };

        const options = {
            method,
            headers: {"Content-Type": "application/json"},
        };

        if (body){
            options.body = JSON.stringify(body);
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        };

        return await response.json();
    }
    catch (error) {
        console.error("Error getting users", error);
        throw error;
    }
};