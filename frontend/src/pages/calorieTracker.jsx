import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { getUserByUsername } from "../services/userService";
import { getMacroSummary, getTotalCalories } from "../services/userLogService";
import { addCustomFoodEntry } from "../services/foodService";

const CalorieTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [totalCalories, setTotalCalories] = useState(0);
  const [macros, setMacros] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userId: localStorage.getItem("userId"),
    name: "",
    description: "",
    portion: "",
    category: "breakfast",
  });

  const username = localStorage.getItem("username");
  const carbsGoal = Math.trunc((calorieGoal * 0.5) / 4);
  const proteinGoal = Math.trunc((calorieGoal * 0.2) / 4);
  const fatsGoal = Math.trunc((calorieGoal * 0.3) / 9);
  const caloriesRemaining = calorieGoal - macros.calories;

  const percentage = (value, goal) => Math.floor(Math.min((value / goal) * 100, 100));

  const fetchUserData = async () => {
    try {
      const userData = await getUserByUsername(username);
      if (userData?.dailyCalories) {
        setCalorieGoal(Math.trunc(userData.dailyCalories));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

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
    fetchUserData();
  }, [username]);

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
  }, [selectedDate, username]);

  useEffect(() => {
    fetchMacroData();
  }, [username, selectedDate]);

  const handleAddEntry = async () => {
    try {
      setIsSubmitting(true);
      await addCustomFoodEntry(formData);
      setShowPopup(false);
      setFormData({
        userId: localStorage.getItem("userId"),
        name: "",
        description: "",
        portion: "",
        category: "breakfast",
      });
      await fetchUserData();
      await fetchMacroData();
    } catch (err) {
      console.error("Error submitting food entry:", err);
      alert("Could not save food entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const macroRows = [
    { label: "Carbs", value: macros.carbs, goal: carbsGoal, color: "bg-rose-500", soft: "bg-rose-100", unit: "g" },
    { label: "Protein", value: macros.protein, goal: proteinGoal, color: "bg-blue-500", soft: "bg-blue-100", unit: "g" },
    { label: "Fats", value: macros.fat, goal: fatsGoal, color: "bg-amber-500", soft: "bg-amber-100", unit: "g" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />

        <main className="p-4 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Daily nutrition</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Calorie Tracker</h2>
              <p className="mt-2 text-sm text-slate-500">Select a date to review or log meals.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd MMM yyyy"
                customInput={
                  <button className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-blue-300">
                    <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                    {selectedDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </button>
                }
              />
              <button
                onClick={() => setShowPopup(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Food
              </button>
            </div>
          </div>

          <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <div className="flex items-center justify-center">
                  <div className="relative h-64 w-64">
                    <svg className="h-full w-full -rotate-90">
                      <circle cx="50%" cy="50%" r="100" stroke="#e2e8f0" strokeWidth="20" fill="none" />
                      <motion.circle
                        cx="50%"
                        cy="50%"
                        r="100"
                        stroke="#f97316"
                        strokeWidth="20"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 100}
                        strokeDashoffset={2 * Math.PI * 100 * (1 - macros.calories / calorieGoal)}
                        initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 100 * (1 - macros.calories / calorieGoal) }}
                        transition={{ duration: 0.8 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <p className="text-4xl font-black text-slate-950">{macros.calories}</p>
                      <p className="text-sm font-semibold text-slate-500">kcal consumed</p>
                      <p className={`mt-3 text-sm font-bold ${caloriesRemaining < 0 ? "text-red-600" : "text-emerald-600"}`}>
                        {Math.abs(caloriesRemaining)} kcal {caloriesRemaining < 0 ? "over" : "remaining"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Goal</p>
                      <p className="mt-1 text-2xl font-black text-slate-950">{calorieGoal}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Logged</p>
                      <p className="mt-1 text-2xl font-black text-slate-950">{Math.trunc(totalCalories)}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Date</p>
                      <p className="mt-1 text-lg font-black text-slate-950">{selectedDate.toLocaleDateString("en-GB")}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    {macroRows.map((row) => (
                      <div key={row.label}>
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-sm font-bold text-slate-700">{row.label}</p>
                          <p className="text-sm font-semibold text-slate-500">
                            {row.value}/{row.goal}
                            {row.unit}
                          </p>
                        </div>
                        <div className={`h-3 rounded-full ${row.soft}`}>
                          <div className={`h-full rounded-full ${row.color}`} style={{ width: `${percentage(row.value, row.goal)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-950">Macro Goals</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your targets are calculated from daily calories: 50% carbs, 20% protein, 30% fats.
              </p>
              <div className="mt-5 space-y-3">
                {macroRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <span className="text-sm font-bold text-slate-700">{row.label}</span>
                    <span className="text-sm font-black text-slate-950">
                      {Math.max(row.goal - row.value, 0)}
                      {row.unit} left
                    </span>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        </main>

        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Add Food Entry</h2>
                  <p className="text-sm text-slate-500">AI will estimate nutrition for the portion.</p>
                </div>
                <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100" onClick={() => setShowPopup(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <input
                  type="text"
                  placeholder="Portion"
                  value={formData.portion}
                  onChange={(e) => setFormData({ ...formData, portion: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="snacks">Snacks</option>
                  <option value="dinner">Dinner</option>
                </select>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="rounded-xl bg-slate-100 px-4 py-3 font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEntry}
                    disabled={isSubmitting}
                    className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isSubmitting ? "Saving..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalorieTracker;
