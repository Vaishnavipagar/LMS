import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { FaChartPie } from "react-icons/fa";

export default function Navbar() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const menuItems = [
    { label: "Home", path: "/#home" },
    { label: "Courses", path: "/#courses" },
    { label: "Paths", path: "/#paths" },
    { label: "Mentors", path: "/#mentors" },
    { label: "Reviews", path: "/#reviews" },
    { label: "Why Us", path: "/#why" },
  ];

  const handleNavClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[1000] flex justify-center pt-5 pointer-events-none transition-all duration-700 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
        }`}
      >
        <div className="absolute inset-0 -z-10 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" />

        <div className="pointer-events-auto flex items-center justify-between w-[95%] sm:w-[90%] lg:min-w-[900px] xl:min-w-[1100px] h-[60px] sm:h-[70px] px-4 sm:px-8 rounded-full bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
          <div
            onClick={() => navigate("/#home")}
            className={`cursor-pointer font-extrabold tracking-tight text-slate-900 text-sm sm:text-base transition-all duration-700 delay-100 ${
              loaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
          >
            The <span className="text-gray-500">Linux </span>School
          </div>

          <ul className="hidden md:flex items-center gap-1 h-full">
            {menuItems.map((item, index) => (
              <li
                key={item.label}
                className={`transition-all duration-500 ${
                  loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                style={{ transitionDelay: `${200 + index * 80}ms` }}
              >
                <Link
                  to={item.path}
                  className="text-slate-600 font-semibold text-sm px-4 py-2 rounded-full transition-all hover:text-slate-900 hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li
              className={`flex items-center justify-end gap-4 ml-3 pl-4 border-l border-slate-200 h-10 min-w-[140px] transition-all duration-500 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{ transitionDelay: `${200 + menuItems.length * 80}ms` }}
            >
              <SignedOut>
                <Link
                  to="/login"
                  className="text-white bg-slate-900 font-bold text-sm px-6 py-2.5 rounded-full transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-300 hover:-translate-y-0.5"
                >
                  Login
                </Link>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center gap-3">
                  <span className="text-slate-700 font-semibold text-sm max-w-[100px] truncate hidden lg:block">
                    {user?.firstName || "Student"}
                  </span>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-10 h-10 border border-slate-200 ring-2 ring-white hover:ring-indigo-100 transition-all",
                      },
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Action
                        label="Dashboard"
                        labelIcon={<FaChartPie className="w-4 h-4" />}
                        onClick={() => navigate("/dashboard")}
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              </SignedIn>
            </li>
          </ul>

          <div
            className="md:hidden flex flex-col justify-between w-6 h-[14px] cursor-pointer"
            onClick={() => setMenuOpen(true)}
          >
            <span className="h-[2px] w-full bg-slate-900 rounded" />
            <span className="h-[2px] w-full bg-slate-900 rounded" />
            <span className="h-[2px] w-full bg-slate-900 rounded" />
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-0 right-0 w-full h-screen z-[2000] bg-white flex items-center justify-center transition-all duration-500 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col gap-7 text-center items-center">
          {menuItems.map((item) => (
            <li
              key={item.label}
              onClick={() => handleNavClick(item.path)}
              className="text-2xl font-bold text-slate-900 cursor-pointer hover:text-indigo-600 transition"
            >
              {item.label}
            </li>
          ))}
          <SignedOut>
            <li
              onClick={() => handleNavClick("/login")}
              className="text-2xl font-bold text-indigo-600 cursor-pointer"
            >
              Login / Signup
            </li>
          </SignedOut>
          <SignedIn>
            <li
              onClick={() => handleNavClick("/dashboard")}
              className="text-2xl font-bold text-slate-900 cursor-pointer hover:text-indigo-600"
            >
              Dashboard
            </li>
            <li className="scale-150 mt-4">
              <UserButton afterSignOutUrl="/" />
            </li>
          </SignedIn>
        </ul>
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 text-xl"
        >
          ✕
        </button>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[1500] bg-black/30 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
