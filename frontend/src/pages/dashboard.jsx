import { Bot, Droplet, Flame, Gauge } from "lucide-react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

const Dashboard = () => {
  const username = localStorage.getItem("username") || "there";

  const tiles = [
    { title: "Track meals", text: "Log food and compare calories with macro goals.", icon: Flame, color: "bg-orange-50 text-orange-600" },
    { title: "Hydration", text: "Add glasses and review your weekly water pattern.", icon: Droplet, color: "bg-sky-50 text-sky-600" },
    { title: "BMI and BMR", text: "Keep goals aligned with activity and target weight.", icon: Gauge, color: "bg-emerald-50 text-emerald-600" },
    { title: "AI coach", text: "Ask for suggestions using your food and water history.", icon: Bot, color: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="p-4 lg:p-8">
          <section className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl lg:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">Health dashboard</p>
            <h2 className="mt-3 text-3xl font-black lg:text-5xl">Welcome back, {username}</h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Use the sidebar to move through meal tracking, hydration, body metrics, and AI suggestions.
            </p>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tiles.map((tile) => {
              const Icon = tile.icon;

              return (
                <div key={tile.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${tile.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950">{tile.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{tile.text}</p>
                </div>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
