import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { getUserByUsername } from "../services/userService";
import { getTotalCalories } from "../services/userLogService";
import { getMacroSummary } from "../services/userLogService";
import { addCustomFoodEntry } from "../services/foodService";
const CalorieTracker = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calorieGoal, setCalorieGoal] = useState(2000); // default fallback
    const [totalCalories, setTotalCalories] = useState(0);
    const [macros, setMacros] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    });
    const [showPopup, setShowPopup] = useState(false);
    const [formData, setFormData] = useState({
        userId: localStorage.getItem("userId"),
        name: '',
        description: '',
        portion: '',
        category: 'breakfast'

    });
    const username = localStorage.getItem("username");


    const carbsGoal = Math.trunc((calorieGoal * 0.5) / 4);

    const proteinGoal = Math.trunc((calorieGoal * 0.2) / 4);

    const fatsGoal = Math.trunc((calorieGoal * 0.3) / 9);

    console.log(macros.calories);
    const percentage = (value, goal) => Math.floor(Math.min((value / goal) * 100, 100));


    const fetchUserData = async () => {
        try {
            const userData = await getUserByUsername(username);
            if (userData?.dailyCalories) {
                setCalorieGoal(Math.trunc((userData.dailyCalories)));
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    useEffect(() => {


        fetchUserData();
    }, [username]);






    // Fetch totalCalories every time selectedDate changes
    useEffect(() => {
        const fetchCalories = async () => {
            try {
                const formattedDate = selectedDate.toISOString().split("T")[0];
                const total = await getTotalCalories(username, formattedDate);
                setTotalCalories(total || 0);
            } catch (error) {
                console.error("Error fetching total calories:", error);
            }
        };
        fetchCalories();
    }, [selectedDate]);


    const fetchMacroData = async () => {
        try {
            const formattedDate = selectedDate.toISOString().split("T")[0];
            const macroData = await getMacroSummary(username, formattedDate);
            if (macroData) {
                setMacros({
                    calories: Math.trunc(macroData.calories || 0),
                    protein: Math.trunc(macroData.protein || 0),
                    carbs: Math.trunc(macroData.carbs || 0),
                    fat: Math.trunc(macroData.fat || 0),
                });
            }
        } catch (error) {
            console.error("Error fetching macros:", error);
        }
    };

    useEffect(() => {



        fetchMacroData();
    }, [username, selectedDate]);

    const handleAddEntry = async () => {
        try {
            await addCustomFoodEntry(formData);
            setShowPopup(false);
            setFormData({ name: "", description: "", portion: "", category:"breakfast" }); 
            fetchUserData();
            fetchMacroData();
            // Optionally reset form or trigger refresh
        } catch (err) {
            console.error("Error submitting food entry:", err);
        }
    };


    return (
        <div className="flex min-h-screen w-screen bg-gradient-to-br from-blue-50 to-white">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar />

                <main className="p-10">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Calorie Tracker</h1>
                    <p className="text-gray-600 mb-6">Select a date to view or log your meals:</p>

                    <div className="relative inline-block">
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd MMM yyyy"
                            customInput={
                                <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm hover:border-blue-400 transition text-gray-700">
                                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                    {selectedDate.toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </button>
                            }
                        />
                    </div>

                    <p className="mt-4 text-sm text-gray-500">
                        Selected Date: {selectedDate.toDateString()}
                    </p>

                    <div className="pb-3 w-180 flex justify-center items-center -mt-55 ml-130 space-x-8 border rounded-2xl shadow-2xl shadow-[#8eb2e7]">
                        {/* Circular Progress Bar */}
                        <div className="flex justify-center mr-20">
                            <div className="relative w-64 h-64">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="100"
                                        stroke="#e5e7eb"
                                        strokeWidth="20"
                                        fill="none"
                                    />
                                    <motion.circle
                                        cx="50%"
                                        cy="50%"
                                        r="100"
                                        stroke="#ffA500"
                                        strokeWidth="20"
                                        fill="none"
                                        strokeDasharray={2 * Math.PI * 100}
                                        strokeDashoffset={2 * Math.PI * 100 * (1 - macros.calories / calorieGoal)}
                                        initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
                                        animate={{
                                            strokeDashoffset:
                                                2 * Math.PI * 100 * (1 - macros.calories / calorieGoal),
                                        }}
                                        transition={{ duration: 1 }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-2xl text-black font-bold text-center">
                                        {macros.calories} kcal
                                        <div className="text-sm text-gray-500 mb-5">
                                            Remaining: <br></br>{calorieGoal - macros.calories} kcal
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Progress Bars */}
                        <div className="flex justify-end mt-6">
                            <div className="p-4 w-70">
                                <div className="space-y-6">
                                    {/* Carbs */}
                                    <div>
                                        <div className="text-sm font-medium text-gray-700">Carbs</div>
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div className="text-xs font-semibold py-1 px-2 uppercase rounded-full text-[#f42424] bg-[#e2b9b9]">
                                                    {percentage(macros.carbs, carbsGoal)}%
                                                </div>
                                            </div>
                                            <div className="flex mb-2">
                                                <div className="flex-1 bg-[#dfa1a1] rounded-full" style={{ height: "6px" }}>
                                                    <div
                                                        className="bg-[#d71212] h-full rounded-full"
                                                        style={{ width: `${percentage(macros.carbs, carbsGoal)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500">{carbsGoal - macros.carbs}g remaining</div>
                                    </div>

                                    {/* macros.protein */}
                                    <div>
                                        <div className="text-sm font-medium text-gray-700">Protein</div>
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div className="text-xs font-semibold py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                                    {percentage(macros.protein, proteinGoal)}%
                                                </div>
                                            </div>
                                            <div className="flex mb-2">
                                                <div className="flex-1 bg-blue-200 rounded-full" style={{ height: "6px" }}>
                                                    <div
                                                        className="bg-blue-500 h-full rounded-full"
                                                        style={{ width: `${percentage(macros.protein, proteinGoal)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500">{proteinGoal - macros.protein}g remaining</div>
                                    </div>

                                    {/* Fats */}
                                    <div>
                                        <div className="text-sm font-medium text-gray-700">Fats</div>
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div className="text-xs font-semibold py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                                                    {percentage(macros.fat, fatsGoal)}%
                                                </div>
                                            </div>
                                            <div className="flex mb-2">
                                                <div className="flex-1 bg-yellow-200 rounded-full" style={{ height: "6px" }}>
                                                    <div
                                                        className="bg-yellow-500 h-full rounded-full"
                                                        style={{ width: `${percentage(macros.fat, fatsGoal)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500">{fatsGoal - macros.fat}g remaining</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                {/* Add Log Button */}
                <div className="-mt-45 ml-10 ">
                    <button
                        onClick={() => setShowPopup(true)}
                        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm hover:border-blue-400 transition text-gray-700"
                    >
                        Add Food Log
                    </button>
                </div>

                {/* Popup Form */}
                {showPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-lg p-8 w-[400px] relative z-50">
                            <h2 className="text-xl text-black font-semibold mb-4">Add Food Entry</h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full text-black border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full text-black border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Portion"
                                    value={formData.portion}
                                    onChange={(e) => setFormData({ ...formData, portion: e.target.value })}
                                    className="w-full text-black border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full text-black border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="snacks">Snacks</option>
                                    <option value="dinner">Dinner</option>
                                </select>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setShowPopup(false)}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddEntry}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Dimmed + Blurred Background Layer */}
                        <div
                            className="absolute inset-0 bg-black/10 backdrop-blur-sm z-40"
                            onClick={() => setShowPopup(false)}
                        ></div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CalorieTracker;
