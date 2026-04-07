import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import BattleScreen from "./battle_components/BattleScreen.jsx";
import HomeContent from "./menu_components/homeContent.jsx";
import AccountContent from "./menu_components/accountContent.jsx";

function PreBattle() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="title">CereBrawl</h1>
      <p className="subtitle">Get ready to enter the battle.</p>

      <button
        className="start-button"
        onClick={() => {
          sessionStorage.removeItem("playerHP");
          sessionStorage.removeItem("enemyHP");
          navigate("/battlescreen");
        }}
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
        <Route path="/" element={<HomeContent />} />
        <Route path="/prebattle" element={<PreBattle />} />
        <Route path="/battlescreen" element={<BattleScreen />} />
        <Route path="/account" element={<AccountContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;