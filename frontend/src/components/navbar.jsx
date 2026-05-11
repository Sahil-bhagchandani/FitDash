import { Bell, Sparkles } from "lucide-react";

const Navbar = () => {
  const username = localStorage.getItem("username") || "there";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Welcome</p>
          <h1 className="truncate text-xl font-bold text-slate-950">Hi, {username}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 sm:flex">
            <Sparkles className="h-4 w-4" />
            Smart nutrition
          </div>
          <button className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
