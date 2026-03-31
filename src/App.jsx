import Header from "./components/Header";
import Dashboard from "./Pages/Dashboard";
import "./App.css";
import UserSync from "./components/UserSync";

export default function App() {
  return (
    <div className="page">
      <UserSync />   {/* 🔥 YE LINE ADD KARO */}
      <Header />
      <Dashboard />
    </div>
  );
}