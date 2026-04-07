import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import BattleScreen from "./battle_components/BattleScreen";
import HomeContent from "./menu_components/homeContent";
import AccountContent from "./menu_components/accountContent";

function PreBattle() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");

  const handleStartBattle = () => {
    if (!topic) return;

    sessionStorage.removeItem("playerHP");
    sessionStorage.removeItem("enemyHP");
    sessionStorage.setItem("battleTopic", topic);

    navigate("/battlescreen", { state: { topic } });
  };

  return (
    <div className="home-container">
      <h1 className="title">CereBrawl</h1>
      <p className="subtitle">Get ready to enter the battle.</p>

      <button
        className="start-button"
        onClick={handleStartBattle}
        disabled={!topic}
      >
        Start Battle
      </button>

      <div className="dropdown-group">
        <select
          id="topic-select"
          className="topic-dropdown"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option value="" disabled>
            Select Topic
          </option>
          <option value="biology">Biology</option>
          <option value="history">History</option>
          <option value="geography">Geography</option>
          <option value="chemistry">Chemistry</option>
          <option value="literature">Literature</option>
          <option value="computer science">Computer Science</option>
        </select>
      </div>
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