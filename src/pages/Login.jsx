import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_COPY as C } from "../data/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 4) {
      setError("Enter a valid email and a 4+ character password.");
      return;
    }
    localStorage.setItem("learnaxis_user", JSON.stringify({ email }));
    navigate("/courses");
  };

  const demo = () => {
    localStorage.setItem("learnaxis_user", JSON.stringify({ email: "demo@learnloop.com" }));
    navigate("/courses");
  };

  return (
    <div className="min-h-screen bg-[#F6F0E6] flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-[24px] overflow-hidden shadow-2xl">
        <div className="bg-[#191817] p-8 sm:p-10 text-white flex flex-col justify-between gap-8">
          <button onClick={() => navigate("/")} className="font-extrabold text-lg text-left">
            {C.brand}
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              {C.panelTitleLines.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </h2>
            <p className="text-white/60 text-[13px] mt-4 leading-relaxed">{C.panelDesc}</p>
            <div className="flex gap-6 mt-7">
              {C.panelStats.map(([n, l]) => (
                <div key={l}>
                  <div className="text-[#F5820B] font-extrabold">{n}</div>
                  <div className="text-white/50 text-[11px]">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/40 text-[11px]">
            New here? <Link to="/courses" className="text-[#F5820B] font-bold">Browse courses first</Link>
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10">
          <h1 className="text-xl font-extrabold tracking-tight text-[#191817]">{C.formTitle}</h1>
          <p className="text-[12px] text-gray-500 mt-1.5">{C.formDesc}</p>

          {error && (
            <p className="mt-4 text-[12px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <form onSubmit={submit}>
            <label className="block text-[12px] font-bold mt-6 text-[#191817]">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F5820B] focus:ring-2 focus:ring-[#F5820B]/20"
            />

            <label className="block text-[12px] font-bold mt-4 text-[#191817]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F5820B] focus:ring-2 focus:ring-[#F5820B]/20"
            />

            <button className="mt-6 w-full rounded-full bg-[#191817] text-white font-bold py-3.5 text-sm hover:bg-black transition">
              Login
            </button>
          </form>
          <button
            onClick={demo}
            className="mt-3 w-full rounded-full bg-[#F5820B] text-white font-extrabold py-3.5 text-sm hover:bg-[#E06F00] transition"
          >
            Continue as demo student
          </button>

          <p className="text-[12px] text-gray-500 mt-5 text-center">
            Frontend demo only — any valid-looking email works.
          </p>
        </div>
      </div>
    </div>
  );
}
