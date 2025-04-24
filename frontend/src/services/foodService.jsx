import { myAxios } from "../services/helper";

// Function to handle the custom food entry (POST request)
export async function addCustomFoodEntry(foodData) {
  try {
    const response = await myAxios.post('/api/food/custom-entry', foodData);
    return response.data;  // Return success message from the backend
  } catch (error) {
    console.error("Error adding custom food entry:", error.message);
    throw error;  // Throw error to be handled by calling component
  }
}
