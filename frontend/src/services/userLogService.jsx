import { myAxios } from "../services/helper";

export async function getUserLogsByUsername(username) {
  try {
    const response = await myAxios.get(`/api/userlog/by-username/${username}`);
    return response.data;
  } catch (error) {
    console.error("Fetch UserLogs Error:", error.message);
    throw error;
  }
}

export async function getTotalCalories(username,date)
{
  try {
    const response = await myAxios.get(`/api/userlog/total/${username}/${date}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Total calories Error:", error.message);
    throw error;
  }
}

export async function getMacroSummary(username, date) {
  try {
    const response = await myAxios.get(`/api/userlog/macro-summary/${username}/${date}`);
    console.log("root");
    console.log(response.data);
    return response.data;  // This will be an object: { calories, protein, carbs, fat }
  } catch (error) {
    console.error("Fetch Macro Summary Error:", error.message);
    throw error;
  }
}

