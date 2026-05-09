# FitDash Examiner Demo Notes

## What Changed

- OpenRouter model IDs are now configurable from environment variables.
- The default model is `openrouter/free`, OpenRouter's free-model router.
- MongoDB and OpenRouter secrets are no longer hardcoded in `application.properties`.
- Backend tests cover the main nutrition app behavior without calling MongoDB or OpenRouter.
- The frontend now points to `http://localhost:8080` by default for local demo runs.

## Local Secrets

Local backend secrets are stored in:

```text
backend/demo/src/main/resources/application-local.properties
```

That file is ignored by Git. It should contain:

```properties
spring.data.mongodb.uri=your-mongodb-uri
openrouter.api.key=your-openrouter-api-key
openrouter.nutrition.model=openrouter/free
openrouter.chatbot.model=openrouter/free
```

## Run Backend Tests

```powershell
cd backend\demo
.\mvnw.cmd test
```

Expected result:

```text
Tests run: 9, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

## Run Locally For Demo

Backend:

```powershell
cd backend\demo
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
```

Frontend:

```powershell
cd frontend
npm.cmd run dev
```

Then open the Vite local URL, usually:

```text
http://localhost:5173
```

## Notes For Examiner

- The test suite does not need Railway, Vercel, MongoDB Atlas, or OpenRouter credits.
- AI nutrition and chatbot features require a valid `OPENROUTER_API_KEY` at runtime.
- If `OPENROUTER_API_KEY` is missing, AI endpoints return a clear configuration message instead of crashing during app startup.
