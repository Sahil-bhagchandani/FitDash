import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import { getBasicUserInfo, updateBmrGoal } from "../services/userService";
import { useNavigate } from "react-router-dom";

const BMR = () => {
    const [bmi, setBmi] = useState(0);
    const [formData, setFormData] = useState({
        username: "",
        height: "",
        weight: "",
        age: "",
        gender: "",
        activityLevel: "",
        targetWeight: "",
        weeklyChange: "",
    });

    // Fetch user info on mount
    useEffect(() => {
        const username = localStorage.getItem("username");
        if (username) {
            getBasicUserInfo(username)
                .then((data) => {
                    setFormData((prev) => ({
                        ...prev,
                        username: data.username,
                        height: data.height,
                        weight: data.weight,
                        age: data.age,
                        gender: data.gender
                    }));
                    setBmi(data.bmi);
                })
                .catch((err) => console.error(err));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const goalData = {
                height: formData.height,
                weight: formData.weight,
                age: formData.age,
                gender: formData.gender,
                exerciseLevel: formData.activityLevel,
                weeklyChange: formData.weeklyChange,
                targetWeight: formData.targetWeight
            };
            await updateBmrGoal(formData.username, goalData);
            alert("Goal and BMR data updated!");
        } catch (error) {
            alert("Something went wrong while submitting.");
        }
    };

    return (
        <div className="flex min-h-screen w-screen bg-gradient-to-br from-blue-50 to-white">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="ml-100 mt-20 h-125 w-1/3 bg-white shadow-xl shadow-[#8eb2e7] rounded-2xl p-6 backdrop-blur-md bg-opacity-80">
                    <h2 className="text-2xl font-bold text-blue-600 mb-6">
                        Your BMI: <span className="text-black">{bmi}</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="text-gray-600">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    disabled
                                    className="text-black w-full p-2 border border-gray-600 rounded-xl mt-2"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="text-gray-600">Height</label>
                                <input
                                    type="text"
                                    name="height"
                                    value={formData.height}
                                    disabled
                                    className="text-black w-full p-2 border border-gray-600 rounded-xl mt-2"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="text-gray-600">Gender</label>
                                <input
                                    type="text"
                                    name="gender"
                                    value={formData.gender}
                                    disabled
                                    className="text-black w-full p-2 border border-gray-600 rounded-xl mt-2"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="text-gray-600">Weight</label>
                                <input
                                    type="text"
                                    name="weight"
                                    value={formData.weight}
                                    disabled
                                    className="text-black w-full p-2 border border-gray-600 rounded-xl mt-2"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">

                            <div className="w-1/2">
                                <label className="text-gray-600">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    disabled
                                    className="text-black w-full p-2 border border-gray-600 rounded-xl mt-2"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="text-gray-600">Activity Level</label>
                                <select
                                    name="activityLevel"
                                    onChange={handleChange}
                                    value={formData.activityLevel}
                                    className="text-black w-full p-2 border border-gray-600 rounded-xl mt-2"
                                    required
                                >
                                    <option value="" disabled hidden>
                                        Select an option
                                    </option>
                                    <option value="Sedentary">Sedentary</option>
                                    <option value="Light">Light</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Active">Active</option>
                                    <option value="Very-Active">Very Active</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="text-gray-600">Target Weight (kg)</label>
                                <input type="text" name="targetWeight" value={formData.targetWeight} onChange={handleChange} className="text-black w-full p-2 border border-gray-600 rounded-xl text-s mt-2" required />
                            </div>
                            <div className="w-1/2">
                                <label className="text-gray-600">Weekly Change (Goal)</label>
                                <select
                                    name="weeklyChange"
                                    onChange={handleChange}
                                    value={formData.weeklyChange}
                                    className="text-black w-full p-2 border border-gray-600 rounded-xl mt-2"
                                    required
                                >
                                    <option value="" disabled hidden>
                                        Select an option
                                    </option>
                                    <option value="0.25">0.25 kg</option>
                                    <option value="0.5">0.5 kg</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="h-10 w-1/4 mx-auto block bg-black text-white p-2 hover:bg-gray-200 hover:text-black rounded-lg mt-5"
                        >
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BMR;
