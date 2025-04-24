import React, { useEffect, useState } from "react";
import { Button } from "../components/button";
import { format, subDays } from "date-fns";
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
} from "../services/waterLogService";

const WaterTracker = () => {
  const [selectedDate] = useState(new Date());
  const [glasses, setGlasses] = useState(0);
  const [weekData, setWeekData] = useState([]);
  const username = localStorage.getItem("username");
  const oneGlassAmount = 250; // ml

  const updateWeekData = async () => {
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
  };

  const fetchTodayGlassCount = async () => {
    const today = format(selectedDate, "yyyy-MM-dd");
    try {
      const totalMl = await getTotalWaterIntakeByDate(username, today);
      setGlasses(Math.round(totalMl / oneGlassAmount));
    } catch (err) {
      console.error("Error fetching today's water intake:", err);
      setGlasses(0);
    }
  };

  useEffect(() => {
    updateWeekData();
    fetchTodayGlassCount();
  }, []);

  const handleAddGlass = async () => {
    if (glasses < 12) {
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

  const handleRemoveGlass = () => {
    setGlasses((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="flex min-h-screen w-screen bg-gradient-to-br from-blue-50 to-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 flex flex-col items-center space-y-6">
          <h1 className="text-2xl font-bold text-left text-black w-full">
            Water Tracker
          </h1>
          <div className="text-lg text-gray-700">
            {format(selectedDate, "PPP")}
          </div>

          <div className="flex flex-col items-center gap-10 w-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-20 h-40 border-4 border-blue-400 rounded-b-full overflow-hidden bg-white">
                <div
                  className="absolute bottom-0 left-0 w-full bg-blue-300 transition-all duration-300"
                  style={{ height: `${(glasses / 12) * 100}%` }}
                ></div>
              </div>
              <div className="flex space-x-4 items-center">
                <Button onClick={handleRemoveGlass}>-</Button>
                <div className="text-lg font-medium">{glasses} Glasses</div>
                <Button onClick={handleAddGlass}>+</Button>
              </div>
            </div>

            <div className="w-full max-w-2xl">
              <h2 className="text-lg font-semibold mb-4">Weekly Overview</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={weekData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="day" />
                  <YAxis
                    label={{
                      value: "Glasses",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Bar dataKey="water" fill="#3b82f6" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
