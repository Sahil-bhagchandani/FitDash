import { useState } from "react";
import { signupUser } from "../services/signUp";
import bg from "../assets/avablue.avif";
import { useNavigate } from "react-router-dom";



const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        weight: "",
        height: "",
        age: "",
        gender: "",
        goal: "",
        email: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await signupUser(formData);
            setSuccess("Signup successful! Please log in.");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div
            className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-tr from-[#FFFFFF] via-[#6DD5FA] to-[#2980B9] px-4"
            style={{
                
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="h-140 w-1/3 bg-white shadow-lg rounded-2xl p-6 backdrop-blur-md bg-opacity-80 xl:rounded-br-none xl:rounded-tr-none">
                <h2 className="text-2xl font-semibold text-center mb-2 text-black ">Sign Up</h2>
                <p className="text-center text-gray-500 mb-4 text-s">Start of your fitness journey.</p>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="text-gray-600">Username</label>
                            <input type="text" name="username" placeholder="Username" onChange={handleChange} value={formData.username} className="text-black placeholder:text-gray-600 w-full p-2 border border-gray-600 rounded-xl text-s mt-2 " required />
                        </div>
                        <div className="w-1/2">
                            <label className="text-gray-600">Email</label>
                            <input type="email" name="email" placeholder="Your Email" onChange={handleChange} value={formData.email} className="text-black placeholder:text-gray-600 w-full p-2 border border-gray-600 rounded-xl text-s mt-2" required />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="text-gray-600">Password</label>
                            <input type="password" name="password" placeholder="Password" onChange={handleChange} value={formData.password} className="text-black placeholder:text-gray-600 w-full p-2 border border-gray-600 rounded-xl text-s mt-2" required />
                        </div>
                        <div className="w-1/2">
                            <label className="text-gray-600">Weight</label>
                            <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} value={formData.weight} className="text-black placeholder:text-gray-600 w-full p-2 border border-gray-600 rounded-xl text-s mt-2" required />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="text-gray-600">Height</label>
                            <input type="number" name="height" placeholder="Height (cm)" onChange={handleChange} value={formData.height} className="text-black placeholder:text-gray-600 w-full p-2 border border-gray-600 rounded-xl text-s mt-2" required />
                        </div>
                        <div className="w-1/2">
                            <label className="text-gray-600">Age</label>
                            <input type="number" name="age" placeholder="Age" onChange={handleChange} value={formData.age} className="text-black placeholder:text-gray-600 w-full p-2 border border-gray-600 rounded-xl text-s mt-2" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="text-gray-600">Gender</label>
                            <select name="gender" onChange={handleChange} value={formData.gender} className="text-black placeholder:text-gray-600 w-full p-2 border border-gray-600 rounded-xl text-s mt-2">
                                <option value="" disabled hidden>Select an option</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="w-1/2">
                            <label className="text-gray-600">Fitness Goal</label>
                            <input type="text" name="goal" placeholder="Fitness Goal" onChange={handleChange} value={formData.goal} className="text-black placeholder:text-gray-600 w-full p-2 border border-gray-600 rounded-xl text-s mt-2" required />
                        </div>
                    </div>

                    <button type="submit" className=" h-10 w-1/4 mx-auto block align:center bg-black text-white p-2 hover:bg-gray-200 hover:text-black rounded-lg text-l font-medium  transition-all duration-100 delay-60 mb-4 mt-5">Continue</button>
                </form>

                <p className="text-center text-gray-500 mt-3 text-s">Have an account? <a href="/login" className="text-cyan-600 cursor-pointer">Log in</a></p>
            </div>
            <img src={bg} alt="" className="h-140 w-[500px] object-cover xl:rounded-tr-2xl xl:rounded-br-2xl xl:block hidden shadow-2xl " />
        </div>
        
    );
};

export default Signup;