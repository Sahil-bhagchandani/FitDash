import { useState } from "react";
import { Activity, ArrowRight, ShieldCheck } from "lucide-react";
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
      await signupUser(formData);
      setSuccess("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <img src={bg} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-slate-950/45" />
          <div className="relative flex h-full flex-col justify-between p-12 text-white">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Activity className="h-4 w-4" />
              FitDash
            </div>
            <div className="max-w-xl">
              <h1 className="text-5xl font-black leading-tight">Build healthier daily decisions.</h1>
              <p className="mt-5 text-lg text-white/80">
                Track calories, water, BMI, and AI nutrition guidance from one focused dashboard.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <ShieldCheck className="h-5 w-5" />
              Your local profile keeps development secrets outside Git.
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-100 px-4 py-10">
          <div className="w-full max-w-xl rounded-2xl border border-white/70 bg-white p-6 shadow-2xl shadow-blue-900/10 sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Create account</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Start your fitness journey</h2>
              <p className="mt-2 text-sm text-slate-500">Add your basics once and FitDash will shape your goals.</p>
            </div>

            {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
            {success && <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success}</p>}

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              {[
                ["Username", "username", "text", "Mohit"],
                ["Email", "email", "email", "you@example.com"],
                ["Password", "password", "password", "Password"],
                ["Weight", "weight", "number", "Weight (kg)"],
                ["Height", "height", "number", "Height (cm)"],
                ["Age", "age", "number", "Age"],
              ].map(([label, name, type, placeholder]) => (
                <label key={name} className="block text-sm font-semibold text-slate-600">
                  {label}
                  <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    onChange={handleChange}
                    value={formData[name]}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required={name !== "age"}
                  />
                </label>
              ))}

              <label className="block text-sm font-semibold text-slate-600">
                Gender
                <select
                  name="gender"
                  onChange={handleChange}
                  value={formData.gender}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                >
                  <option value="" disabled hidden>
                    Select
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-600">
                Fitness Goal
                <input
                  type="text"
                  name="goal"
                  placeholder="maintain, gain weight, loose weight"
                  onChange={handleChange}
                  value={formData.goal}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </label>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-blue-700 sm:col-span-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Have an account?{" "}
              <a href="/login" className="font-bold text-blue-600 hover:text-blue-700">
                Log in
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Signup;
