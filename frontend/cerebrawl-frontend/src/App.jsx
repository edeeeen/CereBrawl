import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import BattleScreen from "./battle_components/BattleScreen.jsx";
import HomeContent from "./menu_components/homeContent.jsx";
import AccountContent from "./menu_components/accountContent.jsx";

function PreBattle() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("1");
  const [topicError, setTopicError] = useState("");

  const validTopics = [
    "biology",
    "history",
    "chemistry",
    "geography",
    "literature",
    "computer science",
  ];

  const handleStartBattle = () => {
    const cleanedTopic = topic.trim().toLowerCase();

    if (!cleanedTopic) return;

    if (!validTopics.includes(cleanedTopic)) {
      setTopicError("Invalid topic. Please enter a valid study topic.");
      return;
    }

    setTopicError("");

    sessionStorage.removeItem("playerHP");
    sessionStorage.removeItem("enemyHP");
    sessionStorage.setItem("battleTopic", cleanedTopic);
    sessionStorage.setItem("battleDifficulty", difficulty);

    navigate("/battlescreen", {
      state: {
        topic: cleanedTopic,
        difficulty: Number(difficulty),
      },
    });
  };

  return (
    <div className="home-container">
      <h1 className="title">CereBrawl</h1>
      <p className="subtitle">Get ready to enter the battle.</p>

      <button
        className="start-button"
        onClick={handleStartBattle}
        disabled={!topic.trim()}
      >
        Start Battle
      </button>

      <div className="dropdown-group">
        <input
          type="text"
          className="topic-dropdown"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            setTopicError("");
          }}
        />

        <select
          className="difficulty-dropdown"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="1">Difficulty 1</option>
          <option value="2">Difficulty 2</option>
          <option value="3">Difficulty 3</option>
          <option value="4">Difficulty 4</option>
        </select>

        {topicError && <p className="topic-error-text">{topicError}</p>}
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