import { myAxios } from "../services/helper";

export async function loginUser(userData) {
    try {
        console.log(userData);
        const response = await myAxios.post("/api/users/login", userData);
        return response.data;
    } catch (error) {
        console.error("Login Error:", error.message);
        throw error;
    }
}
