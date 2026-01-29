const baseURL = "https://devweb2025.cis.strath.ac.uk/~nxb22128/QuizKit_Backend/public/";

export const getUsers = async () => {
    try {
        const response = await fetch(`${baseURL}/users`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error getting users", error);
        throw error;
    }
}