import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BattleScreen.css";

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

  const difficulty = 1;
  const subject =
    location.state?.topic || sessionStorage.getItem("battleTopic") || "biology";

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

      const response = await fetch(
        `https://api.cerebrawl.me/battle/generateQuestion?difficulty=${difficulty}&subject=${encodeURIComponent(subject)}`
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
    }
  };

  const handleBackToMenu = () => {
    sessionStorage.removeItem("playerHP");
    sessionStorage.removeItem("enemyHP");
    sessionStorage.removeItem("battleTopic");
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          answer: letter,
          correctAnswer: questionData.Answer,
          playerHP: playerHP,
          enemyHP: enemyHP,
          difficulty: difficulty,
          questionsRight: questionsRight,
          questionsWrong: questionsWrong,
          critHit: false
        })
      });

      const result = await response.json();
      console.log("API RESPONSE:", result);
      console.log("Selected answer:", letter);
      console.log("Correct answer:", questionData.Answer);
      console.log("API result:", result);

      setPlayerHP(Math.max(result.playerHP, 0));
      setEnemyHP(Math.max(result.enemyHP, 0));
      setDifficulty(result.difficulty);
      setQuestionsRight(result.questionsRight);
      setQuestionsWrong(result.questionsWrong);

      if (result.result === "correct" && result.critHit) {
        setResultMessage("Correct! It's a critical hit.");
        triggerBattleEffect("correct-flash");
      } else if (result.result === "correct") {
        setResultMessage("Correct! Nice hit!");
        triggerBattleEffect("correct-flash");
       } else if (result.result === "wrong" && result.critHit) {
        setResultMessage("Wrong! Critical hit against you!");
        triggerBattleEffect("wrong-flash");
      } else{
        setResultMessage(`Incorrect! The answer was ${questionData.Answer}.`);
        triggerBattleEffect("wrong-flash");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setResultMessage("Something went wrong while submitting the answer.");
    }
  };

  return (
    <div className={`battle-screen ${battleEffect}`}>
      <div className="battlefield">
        <div className="enemy-section">
          <div className="enemy-card">
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

          <div className="player-card">
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
        <div className="question-panel">
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

        <div className="action-panel">
          {!showAttackChoices ? (
            <>
              <div className="top-actions">
                <button
                  className="action-button primary"
                  onClick={handleAttackClick}
                  disabled={gameOver || loadingQuestion || !!questionError}
                >
                  Attack
                </button>

                <button className="action-button primary" disabled={gameOver}>
                  Item
                </button>
              </div>
            </>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default BattleScreen;