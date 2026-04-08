import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BattleScreen.css";
import mini from "../Images/miniShield.png"
import big from "../Images/bigShield.png"
import chug from "../Images/chugJug.png"

function BattleScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const [questionData, setQuestionData] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [questionError, setQuestionError] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [showAttackChoices, setShowAttackChoices] = useState(false);
  const [typedQuestion, setTypedQuestion] = useState("");
  const [battleEffect, setBattleEffect] = useState("");
  const [showItemChoices, setShowItemChoices] = useState(false);

  const [playerHP, setPlayerHP] = useState(() => {
    const saved = sessionStorage.getItem("playerHP");
    return saved !== null ? Number(saved) : 100;
  });

  const [enemyHP, setEnemyHP] = useState(() => {
    const saved = sessionStorage.getItem("enemyHP");
    return saved !== null ? Number(saved) : 100;
  });

  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState("");

  useEffect(() => {
    console.log("=== HP UPDATE ===");
    console.log("Player HP:", playerHP);
    console.log("Enemy HP:", enemyHP);
  }, [playerHP, enemyHP]);

  const rawSubject =
    location.state?.topic ||
    sessionStorage.getItem("battleTopic") ||
    "biology";

  const subject = rawSubject.trim().toLowerCase();

  const rawDifficulty =
    location.state?.difficulty ||
    Number(sessionStorage.getItem("battleDifficulty")) ||
    1;

  const selectedDifficulty = Number(rawDifficulty);

  // Only biology should actually use the selected difficulty.
  const effectiveDifficulty = subject === "biology" ? selectedDifficulty : 1;

  const fullQuestion = useMemo(() => {
    return questionData?.question || "";
  }, [questionData]);

  const fetchQuestion = async () => {
    if (gameOver) return;

    try {
      setLoadingQuestion(true);
      setQuestionError("");
      setSelectedAnswer("");
      setResultMessage("");
      setShowAttackChoices(false);
      setTypedQuestion("");
      setBattleEffect("");

      console.log("FETCHING SUBJECT:", subject);
      console.log("FETCHING DIFFICULTY:", effectiveDifficulty);

      const response = await fetch(
        `https://api.cerebrawl.me/battle/generateQuestion?difficulty=${effectiveDifficulty}&subject=${encodeURIComponent(subject)}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", response.status, errorText);
        throw new Error(`Failed to fetch question: ${response.status}`);
      }

      const data = await response.json();
      setQuestionData(data);
    } catch (error) {
      console.error("Error fetching question:", error);
      setQuestionError("Could not load question.");
    } finally {
      setLoadingQuestion(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("playerHP", String(playerHP));
  }, [playerHP]);

  useEffect(() => {
    sessionStorage.setItem("enemyHP", String(enemyHP));
  }, [enemyHP]);

  useEffect(() => {
    if (!fullQuestion) {
      setTypedQuestion("");
      return;
    }

    setTypedQuestion("");
    let index = 0;

    const interval = setInterval(() => {
      index += 1;
      setTypedQuestion(fullQuestion.slice(0, index));

      if (index >= fullQuestion.length) {
        clearInterval(interval);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [fullQuestion]);

  useEffect(() => {
    if (enemyHP <= 0) {
      setEnemyHP(0);
      setGameOver(true);
      setGameResult("win");
      setShowAttackChoices(false);
      setResultMessage("You defeated the enemy.");
    } else if (playerHP <= 0) {
      setPlayerHP(0);
      setGameOver(true);
      setGameResult("loss");
      setShowAttackChoices(false);
      setResultMessage("You were defeated.");
    }
  }, [playerHP, enemyHP]);

  const handleAttackClick = () => {
    if (!loadingQuestion && !questionError && questionData && !gameOver) {
      setShowAttackChoices(true);
      setShowItemChoices(false);
    }
  };

  const handleItemClick = () => {
    if (!loadingQuestion && !questionError && questionData && !gameOver) {
      setShowItemChoices(true);
      setShowAttackChoices(false);
    }
  };

  const handleBackToMenu = () => {
    sessionStorage.removeItem("playerHP");
    sessionStorage.removeItem("enemyHP");
    sessionStorage.removeItem("battleTopic");
    sessionStorage.removeItem("battleDifficulty");
    navigate("/prebattle");
  };

  const triggerBattleEffect = (type) => {
    setBattleEffect(type);
    setTimeout(() => setBattleEffect(""), 450);
  };

  const handleAnswerClick = async (letter) => {
    if (!questionData || selectedAnswer || gameOver) return;

    setSelectedAnswer(letter);

    try {
      const response = await fetch("https://api.cerebrawl.me/battle/hpAnswerChange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: letter,
          correctAnswer: questionData.Answer,
          playerHP: playerHP,
          enemyHP: enemyHP,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", response.status, errorText);
        throw new Error(`Failed to submit answer: ${response.status}`);
      }

      const result = await response.json();
      console.log("API RESPONSE:", result);
      console.log("Selected answer:", letter);
      console.log("Correct answer:", questionData.Answer);
      console.log("API result:", result);

      setPlayerHP(Math.max(result.playerHP, 0));
      setEnemyHP(Math.max(result.enemyHP, 0));

      if (result.result === "correct") {
        setResultMessage("Correct! Nice hit.");
        triggerBattleEffect("correct-flash");
      } else {
        setResultMessage(`Incorrect! The answer was ${questionData.Answer}.`);
        triggerBattleEffect("wrong-flash");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setResultMessage("Something went wrong while submitting the answer.");
    }
  };

  const handleUseItem = async (itemName) => {
    try {
      const response = await fetch("https://api.cerebrawl.me/battle/useItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          itemName: itemName,
          playerHP: playerHP,
          enemyHP: enemyHP
        })
      });

      const result = await response.json();
      console.log("Use Item API RESPONSE:", result);

      setPlayerHP(Math.max(result.playerHP, 0));
      setEnemyHP(Math.max(result.enemyHP, 0));
      setResultMessage(result.result);

      if(itemName === "Mini Shield") {
        setResultMessage("You used Mini Shield! You gain 10 HP.");
        triggerBattleEffect("correct-flash");
      } else if(itemName === "Big Shield") {
        setResultMessage("You used Big Shield! You gain 20 HP.");
        triggerBattleEffect("correct-flash");
      } else if(itemName === "Chug Jug") {
        setResultMessage("You used Chug Jug! You gain 50 HP.");
        triggerBattleEffect("correct-flash");
      }

      setShowItemChoices(false);
    } catch (error) {
      console.error("Error using item:", error);
      setResultMessage("Something went wrong while using the item.");
    }
  };

  return (
    <div className={`battle-screen ${battleEffect}`}>
      <div className="battlefield">
        <div className="enemy-section">
          <div className="enemy-card" id="monBorder">
            <div className="battle-card-header">
              <span className="battle-name">Professor Elm</span>
              <span className="battle-level">Lv.67</span>
            </div>

            <div className="hp-row">
              <span className="hp-label">HP</span>
              <div className="hp-bar">
                <div
                  className="hp-fill enemy-hp"
                  style={{ width: `${enemyHP}%` }}
                ></div>
              </div>
            </div>
            <div className="hp-value">{enemyHP}/100</div>
          </div>

          <img
            className="enemy-sprite"
            src="/enemy.png"
            alt="Enemy"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />

          <div className="enemy-platform"></div>
        </div>

        <div className="player-section">
          <img
            className="player-sprite"
            src="/player.png"
            alt="Player"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />

          <div className="player-platform"></div>

          <div className="player-card" id="monBorder">
            <div className="battle-card-header">
              <span className="battle-name">Student</span>
              <span className="battle-level">Lv.42</span>
            </div>

            <div className="hp-row">
              <span className="hp-label">HP</span>
              <div className="hp-bar">
                <div
                  className="hp-fill player-hp"
                  style={{ width: `${playerHP}%` }}
                ></div>
              </div>
            </div>

            <div className="hp-value">{playerHP}/100</div>
          </div>
        </div>

        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-modal">
              <h1>{gameResult === "win" ? "You Win!" : "You Lose!"}</h1>
              <p>
                {gameResult === "win"
                  ? "Professor Elm has been defeated."
                  : "You ran out of HP."}
              </p>
              <button className="game-over-button" onClick={handleBackToMenu}>
                Back to Main Menu
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bottom-panel">
        <div className="question-panel" id="picBorder">
          {loadingQuestion && <p className="question-text">Loading question...</p>}

          {!loadingQuestion && questionError && (
            <p className="question-text error-text">{questionError}</p>
          )}

          {!loadingQuestion && !questionError && questionData && (
            <div className="dialogue-box">
              <p className="question-text">
                {typedQuestion}
                {!gameOver && <span className="cursor">|</span>}
              </p>

              {resultMessage && (
                <p
                  className={`result-text fade-in ${
                    resultMessage.startsWith("Correct") ? "correct" : "wrong"
                  }`}
                >
                  {resultMessage}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="action-panel" id="picBorder">
          {!showAttackChoices && !showItemChoices ? (
            <>
              <div className="top-actions" >
                <button
                  className="action-button primary"
                  onClick={handleAttackClick}
                  disabled={gameOver || loadingQuestion || !!questionError}
                >
                  Attack
                </button>

                <button 
                  className="action-button primary" 
                  onClick={handleItemClick}
                  disabled={gameOver || loadingQuestion || !!questionError}
                >
                  Item
                </button>
              </div>
            </>
          ) : showAttackChoices ? (
            <>
              <div className="answer-actions">
                <button
                  className={`action-button ${selectedAnswer === "A" ? "selected" : ""}`}
                  onClick={() => handleAnswerClick("A")}
                  disabled={!!selectedAnswer || gameOver}
                >
                  A. {questionData?.A}
                </button>

                <button
                  className={`action-button ${selectedAnswer === "B" ? "selected" : ""}`}
                  onClick={() => handleAnswerClick("B")}
                  disabled={!!selectedAnswer || gameOver}
                >
                  B. {questionData?.B}
                </button>

                <button
                  className={`action-button ${selectedAnswer === "C" ? "selected" : ""}`}
                  onClick={() => handleAnswerClick("C")}
                  disabled={!!selectedAnswer || gameOver}
                >
                  C. {questionData?.C}
                </button>

                <button
                  className={`action-button ${selectedAnswer === "D" ? "selected" : ""}`}
                  onClick={() => handleAnswerClick("D")}
                  disabled={!!selectedAnswer || gameOver}
                >
                  D. {questionData?.D}
                </button>
              </div>

              <button
                className="action-button secondary-button back-button"
                onClick={fetchQuestion}
                disabled={gameOver || !selectedAnswer}
              >
                Next Question
              </button>
            </>
          ):showItemChoices ? (
            <>
              <div className="item-actions">
                
                <button
                  className="action-button"
                  onClick={() => handleUseItem("Mini Shield")}
                  disabled={gameOver}
                >
                <img
                  src={mini}
                  style={{width:"30px", height:"30px", marginRight:"8px"}}
                />
                  Mini Shield
                </button>
                <button
                  className="action-button"
                  onClick={() => handleUseItem("Big Shield")}
                  disabled={gameOver}
                >
                  <img
                  src={big}
                  style={{width:"30px", height:"30px", marginRight:"8px"}}
                />
                  Big Shield
                </button>
                <button
                  className="action-button"
                  onClick={() => handleUseItem("Chug Jug")}
                  disabled={gameOver}
                >
                  <img
                  src={chug}
                  style={{width:"30px", height:"30px", marginRight:"8px"}}
                />
                  Chug Jug
                </button>
              </div>
              <button
                className="action-button secondary-button back-button"
                onClick={() => {
                  setShowItemChoices(false);
                  setResultMessage("");
                }}
                disabled={gameOver}
              >
                Back
              </button>
            </>
           ) : null 
          }
        </div>
      </div>
    </div>
  );
}

export default BattleScreen;