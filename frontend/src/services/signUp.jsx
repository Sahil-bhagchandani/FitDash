import { myAxios } from "../services/helper";

export async function signupUser(userData) {
  try {
    const response = await myAxios.post("/api/users/register", userData);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Signup Error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Signup failed");
  }
}
