import React from "react";
import { Home, Brain, Droplet, Info } from "lucide-react";

const baseLayout = () => {
  const username =localStorage.getItem("username");
  const avatarUrl = "https://i.pravatar.cc/150?img=3";

  return (
    <div className="flex min-h-screen w-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Sidebar */}
      <aside className="w-80 bg-white shadow-2xl p-6 flex flex-col justify-between rounded-tr-3xl rounded-br-3xl">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-blue-600 tracking-wide">FitDash</h2>
          <nav className="space-y-5 text-sm font-medium">
            <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
              <Home className="w-5 h-5" /> Calorie Tracker
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
              <Brain className="w-5 h-5" /> AI Suggestion
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
              <Droplet className="w-5 h-5" /> Water Intake
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
              <Info className="w-5 h-5" /> About
            </a>
          </nav>
        </div>

        {/* User Info */}
        <div className="mt-10 border-t pt-5 flex items-center gap-4">
          <img src={avatarUrl} alt="User Avatar" className="w-11 h-11 rounded-full border-2 border-blue-200" />
          <div>
            <p className="text-sm font-semibold text-gray-700">{username}</p>
            <p className="text-xs text-gray-400">Member</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome back, {username} 👋</h1>
        <p className="text-gray-600 text-base">Here’s your personalized health dashboard. Navigate through the features from the sidebar.</p>
      </main>
    </div>
  );
};

export default  baseLayout;