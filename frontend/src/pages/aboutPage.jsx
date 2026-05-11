import { Bot, Droplet, LineChart, Target } from "lucide-react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

export default function AboutPage() {
  const features = [
    {
      title: "Calorie tracking",
      text: "Log custom meals and review calories, protein, carbs, and fats by date.",
      icon: Target,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Water intake",
      text: "Track glasses through the day and compare hydration across the week.",
      icon: Droplet,
      color: "bg-sky-50 text-sky-600",
    },
    {
      title: "AI suggestions",
      text: "Use your logs as context for personalized nutrition and habit guidance.",
      icon: Bot,
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "BMI and BMR",
      text: "Calculate daily calorie and water goals using your profile and activity level.",
      icon: LineChart,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="p-4 lg:p-8">
          <section className="overflow-hidden rounded-2xl bg-slate-950 shadow-xl">
            <div className="grid lg:grid-cols-[1fr_360px]">
              <div className="p-6 text-white lg:p-10">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">About FitDash</p>
                <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight lg:text-5xl">
                  A practical dashboard for everyday nutrition decisions.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                  FitDash brings calorie tracking, hydration, body metrics, and AI guidance into one simple workflow so
                  users can review their habits without jumping between tools.
                </p>
              </div>
              <div className="bg-blue-600 p-6 text-white lg:p-10">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-100">Built with</p>
                <div className="mt-5 space-y-3 text-sm font-semibold">
                  <p className="rounded-xl bg-white/15 px-4 py-3">React + Vite</p>
                  <p className="rounded-xl bg-white/15 px-4 py-3">Spring Boot + MongoDB</p>
                  <p className="rounded-xl bg-white/15 px-4 py-3">OpenRouter AI</p>
                  <p className="rounded-xl bg-white/15 px-4 py-3">Recharts visualizations</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ title, text, icon: Icon, color }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
