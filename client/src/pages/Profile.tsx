import { useNavigate } from "react-router-dom";
import { DARAJALAR } from "../types";
import { clearAccount } from "../lib/storage";
import { nextDarajaInfo } from "../lib/gamification";
import { useAppState } from "../state/AppState";

export default function Profile() {
  const { progress, mistakes, settings, isDark, toggleDarkMode, toggleSound } = useAppState();
  const navigate = useNavigate();

  const unsolvedMistakes = mistakes.filter((m) => !m.qaytaYechildi);
  const accuracy = progress.yechilganSavollar
    ? Math.round((progress.togriJavoblar / progress.yechilganSavollar) * 100)
    : 0;
  const { next, needed } = nextDarajaInfo(progress.xp);
  const darajaIdx = DARAJALAR.indexOf(progress.daraja);

  function handleDeleteAccount() {
    if (confirm("Barcha progress, XP va tarix o'chiriladi. Davom etasizmi?")) {
      clearAccount();
      window.location.href = "/";
    }
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="card flex flex-col items-center gap-2 p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sign-blue text-3xl text-white">
          👤
        </div>
        <h1 className="font-heading text-lg font-bold">{progress.daraja}</h1>
        {next && (
          <p className="text-xs text-gray-500">
            Keyingi daraja ({next}) uchun yana {needed} XP kerak
          </p>
        )}
        <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-marking"
            style={{ width: `${((darajaIdx + 1) / DARAJALAR.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Umumiy XP" value={progress.xp} />
        <StatCard label="Streak" value={`🔥 ${progress.streak}`} />
        <StatCard label="Aniqlik" value={`${accuracy}%`} />
      </div>

      <div>
        <h2 className="mb-2 font-heading text-sm font-bold uppercase text-gray-400">Mavzular kesimida</h2>
        <div className="card flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
          {Object.entries(progress.mavzular).length === 0 && (
            <p className="p-4 text-sm text-gray-500">Hali statistika yo'q — birinchi darsni boshlang!</p>
          )}
          {Object.entries(progress.mavzular).map(([mavzu, stat]) => (
            <div key={mavzu} className="flex items-center justify-between p-3 text-sm">
              <span className="capitalize">{mavzu.replace("_", " ")}</span>
              <span className="font-mono-num text-gray-500">
                {stat.togri}/{stat.yechilgan} ({stat.yechilgan ? Math.round((stat.togri / stat.yechilgan) * 100) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate("/tests")}
        className="card focus-ring flex items-center justify-between p-4 text-left"
      >
        <div>
          <p className="font-heading font-bold">Mening xatolarim</p>
          <p className="text-xs text-gray-500">{unsolvedMistakes.length} ta noto'g'ri javob kutmoqda</p>
        </div>
        <span className="text-xl">→</span>
      </button>

      <div>
        <h2 className="mb-2 font-heading text-sm font-bold uppercase text-gray-400">Sozlamalar</h2>
        <div className="card flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
          <SettingRow label="Dark mode" checked={isDark} onToggle={toggleDarkMode} />
          <SettingRow label="Tovushlar" checked={settings.sound} onToggle={toggleSound} />
          <div className="flex items-center justify-between p-4 text-sm">
            <span>Til</span>
            <span className="text-xs text-gray-400">O'zbek (lotin) · rus/kirill tez orada</span>
          </div>
          <button onClick={handleDeleteAccount} className="focus-ring p-4 text-left text-sm text-danger">
            Hisobni o'chirish
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-3 text-center">
      <p className="font-mono-num text-lg font-bold text-sign-blue dark:text-marking">{value}</p>
      <p className="text-[11px] text-gray-500">{label}</p>
    </div>
  );
}

function SettingRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 text-sm">
      <span>{label}</span>
      <button
        onClick={onToggle}
        role="switch"
        aria-checked={checked}
        className={`focus-ring h-6 w-11 rounded-full p-0.5 transition-colors ${checked ? "bg-sign-blue" : "bg-gray-300 dark:bg-gray-600"}`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}
