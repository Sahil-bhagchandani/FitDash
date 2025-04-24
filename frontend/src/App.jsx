import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/signup1";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard"
import CalorieTracker from "./pages/calorieTracker"
import AiSuggestions from "./pages/aiSuggestion"
import WaterTracker from "./pages/waterIntake";
import BMR from "./pages/bmr";
import AboutPage from "./pages/aboutPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/calorietracker" element={<CalorieTracker />} />
                <Route path="/aiSuggestion" element={<AiSuggestions />} />
                <Route path="/waterintake" element={<WaterTracker/>} />
                <Route path="/bmr" element={<BMR/>}/>
                <Route path="/about" element={<AboutPage/>}/>

            </Routes>
        </Router>
    );
}

export default App;
