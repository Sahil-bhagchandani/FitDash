import { myAxios } from "../services/helper";

export async function getUserByUsername(username) {
  try {
    const response = await myAxios.get(`/api/users/${username}`);
    return response.data;
  } catch (error) {
    console.error("Fetch User Error:", error.message);
    throw error;
  }
  
}
export async function getBasicUserInfo(username) {
  try {
    const response = await myAxios.get(`/api/users/${username}/basic-info`);
    return response.data;  // Returns a map with age, weight, height, gender, and bmi
  } catch (error) {
    console.error("Fetch Basic Info Error:", error.message);
    throw error;
  }
}

// Update BMR and goal for the user
export async function updateBmrGoal(username, goalData) {
  try {
    console.log(goalData)
    const response = await myAxios.put(`/api/users/${username}/bmr-goal`, goalData);
    console.log(response.data);
    return response.data;  // Returns success message or error message
  } catch (error) {
    console.error("Update BMR and Goal Error:", error.message);
    throw error;
  }
}