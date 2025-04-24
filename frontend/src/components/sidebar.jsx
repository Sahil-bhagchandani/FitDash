import React, { useState, useEffect } from "react";
import { Home, Brain, Droplet, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { getUserByUsername } from "../services/userService"; // Adjust path as needed

const Sidebar = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [userData, setUserData] = useState(null);

    const username = localStorage.getItem("username");
    const avatarUrl = "https://i.pravatar.cc/150?img=3";

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    useEffect(() => {
        if (showProfile) {
            (async () => {
                try {
                    const data = await getUserByUsername(username);
                    setUserData(data);
                } catch (err) {
                    console.error("Error loading user:", err);
                }
            })();
        }
    }, [showProfile]);

    return (
        <>
            {/* Sidebar */}
            <aside className="w-80 bg-white shadow-2xl p-6 flex flex-col justify-between rounded-tr-none rounded-br-3xl">
                <div>
                    <h2 className="text-2xl font-bold mb-8 text-blue-600 tracking-wide">FitDash</h2>
                    <nav className="space-y-5 text-sm font-medium">
                        <Link to="/calorietracker" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
                            <Home className="w-5 h-5" /> Calorie Tracker
                        </Link>
                        <a href="/aiSuggestion" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
                            <Brain className="w-5 h-5" /> AI Suggestion
                        </a>
                        <a href="/waterintake" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
                            <Droplet className="w-5 h-5" /> Water Intake
                        </a>
                        <a href="/bmr" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
                            <Info className="w-5 h-5" /> BMI and BMR
                        </a>
                        <a href="/about" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
                            <Info className="w-5 h-5" /> About
                        </a>
                    </nav>
                </div>

                <div
                    onClick={() => setShowProfile(true)}
                    className="mt-10 border-t pt-5 flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-xl transition"
                >
                    <img src={avatarUrl} alt="User Avatar" className="w-11 h-11 rounded-full border-2 border-blue-200" />
                    <div>
                        <p className="text-sm font-semibold text-gray-700">{username}</p>
                        <p className="text-xs text-gray-400">Member</p>
                    </div>
                </div>
            </aside>

            {/* Fullscreen Modal with Blur */}
            {showProfile && userData && (
                <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center">
                    <div className="bg-white rounded-3xl shadow-xl p-10 w-[900px] max-w-[95%] relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-6 text-2xl text-gray-500 hover:text-gray-800"
                            onClick={() => setShowProfile(false)}
                        >
                            &times;
                        </button>

                        <div className="flex flex-col items-center mb-8">
                            <img src={avatarUrl} className="w-24 h-24 rounded-full border-4 border-blue-300" alt="User Avatar" />
                            <h2 className="mt-4 text-xl font-bold text-gray-700">Profile Information</h2>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-600">Username</label>
                                <input type="text" value={userData.username} disabled className="w-full text-black border p-2 rounded-lg mt-1 bg-gray-100" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Email</label>
                                <input type="email" value={userData.email} disabled className="w-full border text-black p-2 rounded-lg mt-1 bg-gray-100" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Age</label>
                                <input type="number" value={userData.age} disabled className="w-full border text-black p-2 rounded-lg mt-1 bg-gray-100" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Height (cm)</label>
                                <input type="number" value={userData.height} disabled className="w-full border text-black p-2 rounded-lg mt-1 bg-gray-100" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Weight (kg)</label>
                                <input type="number" value={userData.weight} disabled className="w-full border text-black p-2 rounded-lg mt-1 bg-gray-100" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Gender</label>
                                <input type="text" value={userData.gender} disabled className="w-full border text-black p-2 rounded-lg mt-1 bg-gray-100" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Goal</label>
                                <input type="text" value={userData.goal} disabled className="w-full  border text-black p-2 rounded-lg mt-1 bg-gray-100" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Activity Level</label>
                                <input type="text" value={userData.exerciseLevel} disabled className="w-full border text-black p-2 rounded-lg mt-1 bg-gray-100" />
                            </div>
                        </div>

                        {/* Logout Button Only */}
                        <div className="mt-10 flex justify-end">
                            <button
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
