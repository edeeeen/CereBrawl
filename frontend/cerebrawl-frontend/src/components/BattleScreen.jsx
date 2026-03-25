import { useEffect, useMemo, useState } from "react";
import "./BattleScreen.css";

function BattleScreen() {
  const [questionData, setQuestionData] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [questionError, setQuestionError] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [showAttackChoices, setShowAttackChoices] = useState(false);
  const [typedQuestion, setTypedQuestion] = useState("");
  const [battleEffect, setBattleEffect] = useState("");
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);

  const difficulty = 1;
  const subject = "biology";

  const fullQuestion = useMemo(() => {
    return questionData?.question || "";
  }, [questionData]);

  const fetchQuestion = async () => {
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

  const handleAttackClick = () => {
    if (!loadingQuestion && !questionError && questionData) {
      setShowAttackChoices(true);
    }
  };

  const handleBackToMenu = () => {
    setShowAttackChoices(false);
    setSelectedAnswer("");
    setResultMessage("");
  };

  const triggerBattleEffect = (type) => {
    setBattleEffect(type);
    setTimeout(() => setBattleEffect(""), 450);
  };

  const handleAnswerClick = async (letter) => {
    if (!questionData || selectedAnswer) return;

    setSelectedAnswer(letter);
    
    const response = await fetch("https://api.cerebrawl.me/battle/hpAnswerChange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        answer: letter,
        correctAnswer: questionData.Answer,
        playerHP: playerHP,
        enemyHP: enemyHP
      })
    });

    const result = await response.json();
    console.log("API RESPONSE:", result);

    setPlayerHP(result.playerHP);
    setEnemyHP(result.enemyHP);

    console.log("Selected:", letter, "Correct:", questionData.Answer);

    if(result.result == "correct") {
      setResultMessage("Correct! Nice hit.");
      triggerBattleEffect("correct-flash");
    } else {
      setResultMessage(`Incorrect! The answer was ${questionData.Answer}.`);
      triggerBattleEffect("wrong-flash");
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
                <div className="hp-fill enemy-hp" style={{ width: `${enemyHP}%` }}></div>
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
                <div className="hp-fill player-hp" style={{ width: `${playerHP}%` }}></div>
              </div>
            </div>

            <div className="hp-value">{playerHP}/100</div>
          </div>
        </div>
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
                <span className="cursor">|</span>
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
                <button className="action-button primary" onClick={handleAttackClick}>
                  Attack
                </button>

                <button className="action-button primary">
                  Item
                </button>
              </div>

              <button className="action-button next-button" onClick={fetchQuestion}>
                Next Question
              </button>
            </>
          ) : (
            <>
              <div className="answer-actions">
                <button
                  className={`action-button ${selectedAnswer === "A" ? "selected" : ""}`}
                  onClick={() => handleAnswerClick("A")}
                  disabled={!!selectedAnswer}
                >
                  A. {questionData?.A}
                </button>

                <button
                  className={`action-button ${selectedAnswer === "B" ? "selected" : ""}`}
                  onClick={() => handleAnswerClick("B")}
                  disabled={!!selectedAnswer}
                >
                  B. {questionData?.B}
                </button>

                <button
                  className={`action-button ${selectedAnswer === "C" ? "selected" : ""}`}
                  onClick={() => handleAnswerClick("C")}
                  disabled={!!selectedAnswer}
                >
                  C. {questionData?.C}
                </button>

                <button
                  className={`action-button ${selectedAnswer === "D" ? "selected" : ""}`}
                  onClick={() => handleAnswerClick("D")}
                  disabled={!!selectedAnswer}
                >
                  D. {questionData?.D}
                </button>
              </div>

              <button
                className="action-button secondary-button back-button"
                onClick={handleBackToMenu}
                disabled={false}
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BattleScreen;