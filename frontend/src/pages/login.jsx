import { ArrowRight, LockKeyhole } from "lucide-react";
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
    <main className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-100 px-4 py-10">
          <div className="w-full max-w-md rounded-2xl border border-white/70 bg-white p-8 shadow-2xl shadow-orange-900/10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">Welcome back</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Log in to FitDash</h2>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-slate-600">
                Username
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  placeholder="username"
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-slate-600">
                Password
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  placeholder="Password"
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  required
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-orange-500"
              >
                Log In
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Do not have an account?{" "}
              <a href="/" className="font-bold text-orange-600 hover:text-orange-700">
                Sign up
              </a>
            </p>
          </div>
        </section>

        <section className="relative hidden overflow-hidden lg:block">
          <img src={bg} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-slate-950/35" />
          <div className="relative flex h-full flex-col justify-end p-12 text-white">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-white/70">Daily progress</p>
            <h1 className="max-w-xl text-5xl font-black leading-tight">Your goals stay visible, simple, and measurable.</h1>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
