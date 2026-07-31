import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import { isOnboarded } from "./lib/storage";
import Chat from "./pages/Chat";
import Exam from "./pages/Exam";
import Home from "./pages/Home";
import Lesson from "./pages/Lesson";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import SignCheck from "./pages/SignCheck";
import SignDetail from "./pages/SignDetail";
import SignsCatalog from "./pages/SignsCatalog";
import SignsFlashcards from "./pages/SignsFlashcards";
import Situation from "./pages/Situation";
import Tests from "./pages/Tests";

function TabLayout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[520px] flex-col bg-[var(--bg)] text-[var(--fg)]">
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

function FullScreenLayout() {
  return (
    <div className="mx-auto min-h-screen max-w-[520px] bg-[var(--bg)] text-[var(--fg)]">
      <Outlet />
    </div>
  );
}

function RootEntry() {
  return isOnboarded() ? <Navigate to="/home" replace /> : <Onboarding />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootEntry />} />

      <Route element={<TabLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/signs" element={<SignsCatalog />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route element={<FullScreenLayout />}>
        <Route path="/lesson/:id" element={<Lesson />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/signs/cards" element={<SignsFlashcards />} />
        <Route path="/signs/:id" element={<SignDetail />} />
        <Route path="/situation" element={<Situation />} />
        <Route path="/sign-check" element={<SignCheck />} />
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
