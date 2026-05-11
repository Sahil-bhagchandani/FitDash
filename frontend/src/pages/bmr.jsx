import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import { Activity, ArrowRight, Gauge, Scale } from "lucide-react";
import { getBasicUserInfo, updateBmrGoal } from "../services/userService";

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
            gender: data.gender,
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
        targetWeight: formData.targetWeight,
      };
      await updateBmrGoal(formData.username, goalData);
      alert("Goal and BMR data updated!");
    } catch (error) {
      alert("Something went wrong while submitting.");
    }
  };

  const readonlyFields = [
    ["Username", "username"],
    ["Height", "height"],
    ["Gender", "gender"],
    ["Weight", "weight"],
    ["Age", "age"],
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="p-4 lg:p-8">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Body metrics</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">BMI and BMR Setup</h2>
            <p className="mt-2 text-sm text-slate-500">Confirm activity and target weight to calculate daily goals.</p>
          </div>

          <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
            <aside className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-200">
                <Gauge className="h-7 w-7" />
              </div>
              <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Current BMI</p>
              <p className="mt-2 text-6xl font-black">{bmi || "--"}</p>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                BMI uses your saved height and weight. Your calorie and hydration goals update after submission.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-4">
                  <Scale className="mb-2 h-5 w-5 text-blue-200" />
                  <p className="text-xs text-slate-400">Weight</p>
                  <p className="font-black">{formData.weight || "--"} kg</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <Activity className="mb-2 h-5 w-5 text-blue-200" />
                  <p className="text-xs text-slate-400">Activity</p>
                  <p className="font-black">{formData.activityLevel || "Choose"}</p>
                </div>
              </div>
            </aside>

            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                {readonlyFields.map(([label, name]) => (
                  <label key={name} className="block text-sm font-semibold text-slate-600">
                    {label}
                    <input
                      type="text"
                      name={name}
                      value={formData[name]}
                      disabled
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600"
                    />
                  </label>
                ))}

                <label className="block text-sm font-semibold text-slate-600">
                  Activity Level
                  <select
                    name="activityLevel"
                    onChange={handleChange}
                    value={formData.activityLevel}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  >
                    <option value="" disabled hidden>
                      Select an option
                    </option>
                    <option value="Sedentary">Sedentary</option>
                    <option value="Light">Light</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Active">Active</option>
                    <option value="Very active">Very Active</option>
                  </select>
                </label>

                <label className="block text-sm font-semibold text-slate-600">
                  Target Weight (kg)
                  <input
                    type="text"
                    name="targetWeight"
                    value={formData.targetWeight}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-600">
                  Weekly Change
                  <select
                    name="weeklyChange"
                    onChange={handleChange}
                    value={formData.weeklyChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  >
                    <option value="" disabled hidden>
                      Select an option
                    </option>
                    <option value="0.25">0.25 kg</option>
                    <option value="0.5">0.5 kg</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-blue-700"
                >
                  Save Goals
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default BMR;
