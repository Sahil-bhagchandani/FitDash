import { useCallback, useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Minus, Plus, Waves } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import {
  getTotalWaterIntakeByDate,
  addWaterLog,
  removeWaterLog,
} from "../services/waterLogService";

const WaterTracker = () => {
  const [selectedDate] = useState(new Date());
  const [glasses, setGlasses] = useState(0);
  const [weekData, setWeekData] = useState([]);
  const username = localStorage.getItem("username");
  const oneGlassAmount = 250;
  const maxGlasses = 12;

  const updateWeekData = useCallback(async () => {
    const requests = [];

    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const formatted = format(date, "yyyy-MM-dd");

      const req = getTotalWaterIntakeByDate(username, formatted)
        .then((total) => ({
          day: format(date, "EEE"),
          water: Math.round(total / oneGlassAmount),
        }))
        .catch(() => ({
          day: format(date, "EEE"),
          water: 0,
        }));

      requests.push(req);
    }

    const newWeekData = await Promise.all(requests);
    setWeekData(newWeekData);
  }, [username]);

  const fetchTodayGlassCount = useCallback(async () => {
    const today = format(selectedDate, "yyyy-MM-dd");
    try {
      const totalMl = await getTotalWaterIntakeByDate(username, today);
      setGlasses(Math.round(totalMl / oneGlassAmount));
    } catch (err) {
      console.error("Error fetching today's water intake:", err);
      setGlasses(0);
    }
  }, [selectedDate, username]);

  useEffect(() => {
    updateWeekData();
    fetchTodayGlassCount();
  }, [fetchTodayGlassCount, updateWeekData]);

  const handleAddGlass = async () => {
    if (glasses < maxGlasses) {
      const newGlasses = glasses + 1;
      setGlasses(newGlasses);

      try {
        await addWaterLog(username, oneGlassAmount);
        await updateWeekData();
      } catch (error) {
        console.error("Failed to add water log:", error);
      }
    }
  };

  const handleRemoveGlass = async () => {
    if (glasses <= 0) return;

    const previousGlasses = glasses;
    setGlasses((prev) => Math.max(prev - 1, 0));

    try {
      const removed = await removeWaterLog(username, oneGlassAmount);
      if (!removed) {
        setGlasses(previousGlasses);
        return;
      }
      await updateWeekData();
    } catch (error) {
      console.error("Failed to remove water log:", error);
      setGlasses(previousGlasses);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="p-4 lg:p-8">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Hydration</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Water Tracker</h2>
            <p className="mt-2 text-sm text-slate-500">{format(selectedDate, "PPP")}</p>
          </div>

          <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
            <aside className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                <Waves className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-black text-slate-950">Today</h3>
              <p className="mt-1 text-sm text-slate-500">{glasses * oneGlassAmount} ml logged</p>

              <div className="mx-auto mt-8 h-64 w-32 overflow-hidden rounded-b-full rounded-t-2xl border-4 border-sky-300 bg-sky-50 shadow-inner">
                <div
                  className="mt-auto h-full w-full bg-sky-400 transition-all duration-300"
                  style={{
                    transform: `translateY(${100 - Math.min((glasses / maxGlasses) * 100, 100)}%)`,
                  }}
                />
              </div>

              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={handleRemoveGlass}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-3xl font-black text-slate-950">{glasses}</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Glasses</p>
                </div>
                <button
                  onClick={handleAddGlass}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </aside>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-950">Weekly Overview</h3>
                <p className="mt-1 text-sm text-slate-500">Each bar shows glasses logged per day.</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "#eff6ff" }} />
                    <Bar dataKey="water" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={34} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default WaterTracker;
