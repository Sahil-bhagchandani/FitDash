import { myAxios } from "../services/helper";

// Add water log
export async function addWaterLog(username, amount) {
  try {
    const response = await myAxios.post(
      `/api/waterlog/add`,
      { username, amount },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Add Water Log Error:", error.message);
    throw error;
  }
}

export async function getTotalWaterIntakeByDate(username,date)
{
  try {
    const response = await myAxios.get(`/api/waterlog/total/${username}/${date}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Total water intake Error:", error.message);
    throw error;
  }
}