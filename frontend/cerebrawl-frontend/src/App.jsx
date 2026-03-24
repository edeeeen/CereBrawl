import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import BattleScreen from "./components/BattleScreen";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="title">CereBrawl</h1>
      <p className="subtitle">Get ready to enter the battle.</p>

      <button
        className="start-button"
        onClick={() => navigate("/battlescreen")}
      >
        Start Battle
      </button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/battlescreen" element={<BattleScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;