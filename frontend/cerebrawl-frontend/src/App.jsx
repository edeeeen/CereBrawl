import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import BattleScreen from "./battle_components/BattleScreen.jsx";
import HomeContent from "./menu_components/homeContent.jsx";
import AccountContent from "./menu_components/accountContent.jsx";
import TutorialScreen from "./tutorial_components/TutorialScreen.jsx";
import Image from "./Images/elgato.png";
import "../styleSheets/mainMenu.css";
import "./index.css";
import SideBar from "./menu_components/sideBar.jsx";

function PreBattle() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("1");
  const [quiz, setQuiz] = useState("");
  const [topicError, setTopicError] = useState("");

  /*const validTopics = [
    "biology",
    "history",
    "chemistry",
    "geography",
    "literature",
    "computer science",
  ];
  */
  const getQuiz = async (topic) => {
  try {
    const cleanedTopic = topic.trim().toLowerCase();
    const response = await fetch(
      `https://api.cerebrawl.me/battle/generateQuiz?topic=${encodeURIComponent(cleanedTopic)}`
    );

    if (!response.ok) throw new Error("Failed to fetch quiz");

    const data = await response.json();
    setQuiz(data.quiz);

    return data.quiz;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const handleStartBattle = async () => {
  const cleanedTopic = topic.trim().toLowerCase();
  if (!cleanedTopic) return;

  const generatedQuiz = await getQuiz(cleanedTopic);

  if (!generatedQuiz) {
    setTopicError("Failed to generate quiz");
    return;
  }

  sessionStorage.setItem("battleQuiz", generatedQuiz);
  sessionStorage.setItem("battleTopic", cleanedTopic);
  sessionStorage.setItem("battleDifficulty", difficulty);

  navigate("/battlescreen", {
    state: {
      topic: cleanedTopic,
      difficulty: Number(difficulty),
    },
  });
};

  const handleTut = () => {
    navigate("/tutorial");
  };

  return (
    <div>
      {/* Header */}
      <div
        className="pageHead"
        id="picBorder"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div
          style={{
            width: "fit-content",
            height: "fit-content",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <h1
            className="normalTB"
            style={{
              fontSize: "48px",
              marginBottom: "0px",
              padding: "0px",
              width: "fit-content",
              height: "fit-content",
            }}
          >
            Prepare for Battle!
          </h1>

          <h4
            style={{
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingBottom: "20px",
              paddingTop: "0px",
              margin: "0px",
              color: "black",
              textShadow: "none",
              fontSize: "22px",
            }}
          >
            Choose your topic and difficulty
          </h4>
        </div>

        <img
          src={Image}
          alt="CereBrawl mascot"
          style={{
            margin: "1rem",
            border: "5px inset #11576a",
            background: "grey",
          }}
        />
      </div>

      {/* Main body */}
      <div className="BodyBox">
        {/* Left panel */}
        <SideBar />

        {/* Middle panel */}
        <div className="MiddlePanel" id="picBorder">
          <div className="MidInfo">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <h2
                className="normalTB"
                style={{ fontSize: "40px" }}
              >
                Enter the
              </h2>

              <h1
                style={{
                  margin: "0",
                  fontSize: "44px",
                }}
                id="rainbow"
              >
                Battle Setup
              </h1>
            </div>

            <p
              style={{
                marginTop: "0",
                marginLeft: "1rem",
                marginRight: "1rem",
                color: "black",
                textShadow: "none",
                fontSize: "22px",
              }}
            >
              Pick a valid study topic and difficulty, then start your battle.
            </p>

            <div className="prebattle-form">
              <input
                type="text"
                className="prebattle-input"
                placeholder="Enter Topic"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setTopicError("");
                }}
              />

              <select
                className="prebattle-input"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="1">Difficulty 1</option>
                <option value="2">Difficulty 2</option>
                <option value="3">Difficulty 3</option>
                <option value="4">Difficulty 4</option>
              </select>

              <button
                className="battle-button"
                onClick={handleStartBattle}
                disabled={!topic.trim()}
              >
                Start Battle
              </button>

              {topicError && (
                <p className="topic-error-text">
                  {topicError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="SidePanel" id="picBorder">
          <p
            style={{
              margin: "12px",
              color: "black",
              fontSize: "24px",
              lineHeight: "1.5",
            }}
          >
            Enter any topic of your desire
          </p>
        </div>
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
        <Route path="/tutorial" element={<TutorialScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;