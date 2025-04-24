import { FaGoogle, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import { useState } from "react";
import { loginUser } from "../services/loginService";
import { useNavigate } from "react-router-dom";
import bg from "../assets/banana.avif";
function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(credentials);
            const response = await loginUser(credentials);
            localStorage.setItem("userId", response.userId);
            localStorage.setItem("username", response.username);

            
            setTimeout(() => {
                navigate("/bmr");
              }, 500);
        } catch (error) {
            alert("Login Failed: " + error.message);
        }
    };


    return (
        <div
            className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-tr from-[#FFF] via-[#F2C94C] to-[#eeb007] px-4"
            style={{
                
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            <div className="block justify-center h-140  w-1/3 bg-white shadow-2xl  rounded-2xl p-6 backdrop-blur-md bg-opacity-80 xl:rounded-tr-none xl:rounded-br-none">
                <h2 className="text-2xl font-semibold text-center mb-2 text-black">🔐 <br></br>Log In</h2>
                <p className="text-center text-gray-500 mb-4 text-s">Welcome back! Log in to continue.</p>

                <form className="space-y-2 w-full" onSubmit={handleSubmit}>
                    <label className=" text-gray-600">Username</label>
                    <input type="text" name="username" value={credentials.username} placeholder="username" onChange={handleChange} className="text-black placeholder:text-gray-500 w-full p-2 border border-black rounded-lg text-s mt-2 mb-4" />
                    <label className="text-gray-600">Password</label>
                    <input type="password" name="password" value={credentials.password} placeholder="Password" onChange={handleChange} className="text-black placeholder:text-gray-500 w-full p-2 border border-black rounded-lg text-s mt-2 mb-7" />



                    <button type="submit" className=" h-10 w-1/4 mx-auto block align:center bg-black text-white p-2 hover:bg-gray-200 hover:text-black rounded-lg text-l font-medium  transition-all duration-100 delay-60 mb-4">Log In</button>
                </form>
                
                <p className="text-center text-gray-500 mt-3 mb-6 text-s">Don't have an account? <a href="/" className="text-blue-500 cursor-pointer">Signup</a></p>
                <div className="flex justify-center">
    
                <button className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-red-600 text-2xl hover:bg-gray-300 transition mr-10">
              <FaGoogle />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-blue-700 text-2xl hover:bg-gray-300 transition mr-10">
              <FaFacebookF />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-black text-2xl hover:bg-gray-300 transition">
              <FaXTwitter />
            </button>
                </div>
            </div>
            <img src={bg} alt="" className="h-140 w-[500px] object-cover xl:rounded-tr-2xl xl:rounded-br-2xl xl:block hidden shadow-2xl " />
        </div>
    );
    
}

export default Login;
