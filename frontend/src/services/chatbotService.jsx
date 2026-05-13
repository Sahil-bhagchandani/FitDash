import { myAxios } from "../services/helper";

export async function getChatbotSuggestion(username, userPrompt, date) {
  try {
    const response = await myAxios.post("/api/chatbot/get-suggestion", {
      username,
      userPrompt,
      date,
    });
    console.log(username + userPrompt + response.data);
    return response.data;
  } catch (error) {
    console.error("Chatbot Suggestion Error:", error.message);
    throw error;
  }
}
