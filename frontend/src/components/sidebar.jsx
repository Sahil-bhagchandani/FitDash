import { useEffect, useState } from "react";
import { Bot, Droplet, Gauge, Home, Info, LogOut, Target, UserRound, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getUserByUsername } from "../services/userService";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/calorietracker", label: "Calorie Tracker", icon: Target },
  { to: "/aiSuggestion", label: "AI Suggestion", icon: Bot },
  { to: "/waterintake", label: "Water Intake", icon: Droplet },
  { to: "/bmr", label: "BMI and BMR", icon: Gauge },
  { to: "/about", label: "About", icon: Info },
];

const Sidebar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState(null);

  const username = localStorage.getItem("username") || "Guest";
  const avatarUrl = "https://i.pravatar.cc/150?img=3";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!showProfile || !username || username === "Guest") return;

    (async () => {
      try {
        const data = await getUserByUsername(username);
        setUserData(data);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    })();
  }, [showProfile, username]);

  return (
    <>
      <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white/95 p-5 shadow-sm lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="mb-8">
            <p className="text-2xl font-black tracking-tight text-slate-950">FitDash</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-blue-500">Nutrition OS</p>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          onClick={() => setShowProfile(true)}
          className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
        >
          <img src={avatarUrl} alt="User avatar" className="h-11 w-11 rounded-full border-2 border-white shadow-sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800">{username}</p>
            <p className="text-xs text-slate-500">Member</p>
          </div>
        </button>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-6 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur lg:hidden">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex h-12 items-center justify-center rounded-xl transition ${
                isActive ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
              }`
            }
          >
            <Icon className="h-5 w-5" />
          </NavLink>
        ))}
      </nav>

      {showProfile && userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={avatarUrl} className="h-16 w-16 rounded-full border-4 border-blue-100" alt="User avatar" />
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Profile</h2>
                  <p className="text-sm text-slate-500">Your current FitDash details</p>
                </div>
              </div>
              <button
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                onClick={() => setShowProfile(false)}
                aria-label="Close profile"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Username", userData.username],
                ["Email", userData.email],
                ["Age", userData.age],
                ["Height", `${userData.height} cm`],
                ["Weight", `${userData.weight} kg`],
                ["Gender", userData.gender],
                ["Goal", userData.goal],
                ["Activity Level", userData.exerciseLevel || "Not set"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
