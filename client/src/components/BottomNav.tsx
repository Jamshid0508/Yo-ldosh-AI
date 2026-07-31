import { NavLink } from "react-router-dom";

const items = [
  { to: "/home", label: "Bosh sahifa", icon: "🏠" },
  { to: "/tests", label: "Testlar", icon: "📝" },
  { to: "/chat", label: "AI Chat", icon: "💬", center: true },
  { to: "/signs", label: "Belgilar", icon: "🛑" },
  { to: "/profile", label: "Profil", icon: "👤" },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-[520px] -translate-x-1/2 border-t px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2"
      style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
      aria-label="Asosiy navigatsiya"
    >
      <ul className="flex items-end justify-between">
        {items.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                [
                  "focus-ring flex flex-col items-center gap-0.5 rounded-btn py-1 text-xs font-medium transition-colors",
                  item.center
                    ? "mx-auto -mt-6 h-14 w-14 justify-center rounded-full text-2xl shadow-btn-3d"
                    : "",
                  item.center
                    ? isActive
                      ? "bg-sign-blue text-white"
                      : "bg-sign-blue text-white opacity-90"
                    : isActive
                    ? "text-sign-blue dark:text-white"
                    : "text-gray-500 dark:text-gray-400",
                ].join(" ")
              }
            >
              <span className={item.center ? "text-2xl" : "text-xl"} aria-hidden>
                {item.icon}
              </span>
              {!item.center && <span>{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
