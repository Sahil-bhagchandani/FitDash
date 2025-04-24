import React from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

const Dashboard = () => {
  const username = localStorage.getItem("username");

  return (
    <div className="flex min-h-screen w-screen bg-gradient-to-br from-blue-50 to-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome back, {username} 👋</h1>
          <p className="text-gray-600 text-base">Here’s your personalized health dashboard. Navigate through the features from the sidebar.</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
