# FitDash

FitDash is a full-stack AI nutrition dashboard that helps users track calories, macros, water intake, BMI, BMR, and personal health goals. The application combines a React frontend with a Spring Boot backend, MongoDB persistence, and OpenRouter-powered AI features for nutrition estimation and health suggestions.

## Features

1. User registration and login.
2. Personalized dashboard after authentication.
3. BMI and BMR calculation based on age, height, weight, gender, goal, and activity level.
4. Daily calorie and macro tracking.
5. Custom food entry with AI-generated nutrition values.
6. Water intake tracking with daily and weekly progress.
7. AI health suggestion chatbot using user food and water logs.
8. Responsive frontend with sidebar and navbar navigation.
9. MongoDB-backed storage for users, food entries, calorie logs, and water logs.
10. Backend service tests for main business logic.

## Tech Stack

### Frontend

1. React 19
2. Vite
3. Tailwind CSS
4. React Router
5. Axios
6. Recharts
7. Lucide React
8. Framer Motion
9. React Datepicker

### Backend

1. Java 21
2. Spring Boot 3.4.3
3. Spring Web
4. Spring Data MongoDB
5. Maven
6. JUnit
7. Mockito

### External Services

1. MongoDB for database storage.
2. OpenRouter API for AI nutrition estimation and chatbot suggestions.

## Project Structure

```text
FitDash/
  backend/
    demo/
      src/main/java/com/example/demo/
        Controllers/
        Models/
        Repositories/
        Services/
        config/
      src/main/resources/
      src/test/java/com/example/demo/
      pom.xml
      Dockerfile
  frontend/
    src/
      assets/
      components/
      pages/
      services/
      App.jsx
      main.jsx
    package.json
    vite.config.js
  EXAMINER_DEMO.md
  README.md
```

## Main Frontend Pages

1. Signup page: collects user profile and account details.
2. Login page: authenticates the user and stores user details locally.
3. Dashboard page: provides quick navigation to major health modules.
4. BMR page: calculates BMI, BMR, daily calories, and water goal.
5. Calorie tracker page: records custom food entries and displays macro progress.
6. Water intake page: tracks glasses of water and weekly intake history.
7. AI suggestion page: provides chatbot-based health advice.
8. About page: describes the application and its purpose.

## Backend Modules

### Controllers

1. `UserController`: handles registration, login, user details, basic information, and BMR goal updates.
2. `FoodController`: handles custom food entries.
3. `UserLogController`: returns calorie logs, total calories, and macro summaries.
4. `WaterLogController`: handles water logging and total water intake.
5. `ChatBotController`: handles AI chatbot suggestion requests.

### Services

1. `UserService`: manages user authentication, BMI, BMR, calorie goals, and water goals.
2. `FoodService`: saves AI-generated food nutrition data and creates user food logs.
3. `UserLogService`: fetches food logs and calculates calorie or macro summaries.
4. `WaterLogService`: saves and summarizes water intake.
5. `OpenRouterNutritionService`: calls OpenRouter to estimate food nutrition.
6. `ChatbotService`: builds user context and requests AI health suggestions.

### Models

1. `User`
2. `Foods`
3. `UserLogs`
4. `WaterLogs`
5. `CustomFoodRequest`
6. `ChatBotRequest`

## API Overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Log in an existing user |
| GET | `/api/users/{username}` | Fetch full user details |
| GET | `/api/users/{username}/basic-info` | Fetch age, height, weight, gender, username, and BMI |
| PUT | `/api/users/{username}/bmr-goal` | Update BMR, goal, activity level, daily calories, target weight, and water goal |
| POST | `/api/food/custom-entry` | Add custom food and generate nutrition details using AI |
| GET | `/api/userlog/by-username/{username}` | Fetch all food logs for a user |
| GET | `/api/userlog/total/{username}/{date}` | Fetch total calories for a user on a date |
| GET | `/api/userlog/macro-summary/{username}/{date}` | Fetch calories, protein, carbs, and fat totals |
| POST | `/api/waterlog/add` | Add water intake for a user |
| GET | `/api/waterlog/total/{username}/{date}` | Fetch total water intake for a date |
| POST | `/api/chatbot/get-suggestion` | Get AI health suggestion based on user prompt and logs |

## Prerequisites

1. Java 21
2. Node.js and npm
3. MongoDB local instance or MongoDB Atlas connection string
4. OpenRouter API key for AI features

## Environment Variables

### Backend

Create a local properties file at:

```text
backend/demo/src/main/resources/application-local.properties
```

Add the following values:

```properties
spring.data.mongodb.uri=your-mongodb-uri
openrouter.api.key=your-openrouter-api-key
openrouter.nutrition.model=openrouter/free
openrouter.chatbot.model=openrouter/free
```

The main `application.properties` also supports environment variables:

```properties
MONGODB_URI
OPENROUTER_API_KEY
OPENROUTER_NUTRITION_MODEL
OPENROUTER_CHATBOT_MODEL
CORS_ALLOWED_ORIGINS
```

### Frontend

Optional frontend environment variable:

```text
VITE_API_BASE_URL=http://localhost:8080
```

If this value is not set, the frontend uses `http://localhost:8080` by default.

## Run Locally

### Backend

```powershell
cd backend\demo
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
```

The backend runs at:

```text
http://localhost:8080
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend usually runs at:

```text
http://localhost:5173
```

## Testing

Run backend tests:

```powershell
cd backend\demo
.\mvnw.cmd test
```

The backend test suite covers:

1. User login behavior.
2. BMR, BMI, calorie goal, and water goal calculations.
3. Food entry logging.
4. Macro summary calculation.
5. Water intake logging and summary.
6. OpenRouter nutrition JSON extraction.

## Deployment Notes

### Frontend

The frontend includes Vercel configuration and can be deployed as a Vite React application. Set `VITE_API_BASE_URL` to the deployed backend URL.

### Backend

The backend can be packaged as a Spring Boot application or deployed using the included Dockerfile. Configure MongoDB and OpenRouter values through environment variables in the hosting platform.

## Security Notes

1. Do not commit real MongoDB connection strings.
2. Do not commit OpenRouter API keys.
3. Use `application-local.properties` for local secrets.
4. Configure allowed CORS origins for production deployments.

## Examiner Demo

See `EXAMINER_DEMO.md` for quick demo commands, expected test output, and local setup notes.

