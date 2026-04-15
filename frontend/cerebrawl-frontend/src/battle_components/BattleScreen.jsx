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
  const [showItemChoices1, setShowItemChoices1] = useState(false);
  const [showItemChoices2, setShowItemChoices2] = useState(false);
  const [damageMultiplier, setDamageMultiplier] = useState(1.0);
  const [aIsAvailable, setAIsAvailable] = useState(true);
  const [bIsAvailable, setBIsAvailable] = useState(true);
  const [cIsAvailable, setCIsAvailable] = useState(true);
  const [dIsAvailable, setDIsAvailable] = useState(true);
  const [numOfItems, setNumOfItems] = useState({
    "Mini Shield": 2,
    "Big Shield": 1,
    "Chug Jug": 2,
    "Damage Boost": 1,
    "Damage Mega Boost": 1,
    "Damage Ultra Boost": 1,
    "Small Hint": 1,
    "Big Hint": 1
  });

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

  const rawQuiz =
    location.state?.quiz ||
    sessionStorage.getItem("battleQuiz") ||
    "";
  
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
      setAIsAvailable(true);
      setBIsAvailable(true);
      setCIsAvailable(true);
      setDIsAvailable(true);


      console.log("FETCHING SUBJECT:", subject);
      console.log("FETCHING DIFFICULTY:", effectiveDifficulty);
      console.log("FETCHING QUIZ:", rawQuiz);

      const response = await fetch(
        `https://api.cerebrawl.me/battle/generateQuestion?quiz=${encodeURIComponent(rawQuiz)}&difficulty=${effectiveDifficulty}`
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
      setShowItemChoices1(false);
      setShowItemChoices2(false);
    }
  };

  const handleItemClick = () => {
    if (!loadingQuestion && !questionError && questionData && !gameOver) {
      setShowItemChoices1(true);
      setShowItemChoices2(false);
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
          damageMultiplier: damageMultiplier
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
      setDamageMultiplier(result.damageMultiplier);

      if (result.result === "correct") {
        setResultMessage("Correct! Nice hit.");
        triggerBattleEffect("correct-flash");
        setDamageMultiplier(1.0); 
      } else {
        setResultMessage(`Incorrect! The answer was ${questionData.Answer}.`);
        triggerBattleEffect("wrong-flash");
        setDamageMultiplier(1.0);
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
          enemyHP: enemyHP,
          damageMultiplier: damageMultiplier
        })
      });

      const result = await response.json();
      console.log("Use Item API RESPONSE:", result);

      setPlayerHP(Math.max(result.playerHP, 0));
      setEnemyHP(Math.max(result.enemyHP, 0));
      setResultMessage(result.result);
      setDamageMultiplier(result.damageMultiplier);

      if(itemName === "Mini Shield") {
        setResultMessage("You used Mini Shield! You gain 10 HP.");
        triggerBattleEffect("correct-flash");
        setNumOfItems(prev => ({
          ...prev,
          "Mini Shield": prev["Mini Shield"] - 1
        }));
      } else if(itemName === "Big Shield") {
        setResultMessage("You used Big Shield! You gain 20 HP.");
        triggerBattleEffect("correct-flash");
        setNumOfItems(prev => ({
          ...prev,
          "Big Shield": prev["Big Shield"] - 1
        }));
      } else if(itemName === "Chug Jug") {
        setResultMessage("You used Chug Jug! You gain 50 HP.");
        triggerBattleEffect("correct-flash");
        setNumOfItems(prev => ({
          ...prev,
          "Chug Jug": prev["Chug Jug"] - 1
        }));
      } else if(itemName === "Damage Boost") {
        setResultMessage("You used Damage Boost! Your next attack will be stronger.");
        triggerBattleEffect("correct-flash");
        setNumOfItems(prev => ({
          ...prev,
          "Damage Boost": prev["Damage Boost"] - 1
        }));
      } else if(itemName === "Damage Mega Boost") {
        setResultMessage("You used Damage Mega Boost! Your next attack will be even stronger.");
        triggerBattleEffect("correct-flash");
        setNumOfItems(prev => ({
          ...prev,
          "Damage Mega Boost": prev["Damage Mega Boost"] - 1
        }));
      } else if(itemName === "Damage Ultra Boost") {
        setResultMessage("You used Damage Ultra Boost! Your next attack will be the strongest.");
        triggerBattleEffect("correct-flash");
        setNumOfItems(prev => ({
          ...prev,
          "Damage Ultra Boost": prev["Damage Ultra Boost"] - 1
        }));
      } else if(itemName === "Small Hint") {
        if(questionData?.Answer === "A"){
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if(randomNumber === 1) {
            setBIsAvailable(false);
            setResultMessage(`You used Small Hint! B is incorrect.`);
        triggerBattleEffect("correct-flash");
          }else if(randomNumber === 2) {
            setCIsAvailable(false);
            setResultMessage(`You used Small Hint! C is incorrect.`);
            triggerBattleEffect("correct-flash");
          }else {
            setDIsAvailable(false);
            setResultMessage(`You used Small Hint! D is incorrect.`);
            triggerBattleEffect("correct-flash");
          }
        }else if(questionData?.Answer === "B"){
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if(randomNumber === 1) {
            setAIsAvailable(false);
            setResultMessage(`You used Small Hint! A is incorrect.`);
            triggerBattleEffect("correct-flash");
          }else if(randomNumber === 2) {
            setCIsAvailable(false);
            setResultMessage(`You used Small Hint! C is incorrect.`);
            triggerBattleEffect("correct-flash");
          }else {
            setDIsAvailable(false);
            setResultMessage(`You used Small Hint! D is incorrect.`);
            triggerBattleEffect("correct-flash");
          }
        }else if(questionData?.Answer === "C"){
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if(randomNumber === 1) {
            setAIsAvailable(false);
            setResultMessage(`You used Small Hint! A is incorrect.`);
            triggerBattleEffect("correct-flash");
          }else if(randomNumber === 2) {
            setBIsAvailable(false);
            setResultMessage(`You used Small Hint! B is incorrect.`);
            triggerBattleEffect("correct-flash");
          }else {
            setDIsAvailable(false);
            setResultMessage(`You used Small Hint! D is incorrect.`);
            triggerBattleEffect("correct-flash");
          }
        }else if(questionData?.Answer === "D"){
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if(randomNumber === 1) {
            setAIsAvailable(false);
            setResultMessage(`You used Small Hint! A is incorrect.`);
            triggerBattleEffect("correct-flash");
          }else if(randomNumber === 2) {
            setBIsAvailable(false);
            setResultMessage(`You used Small Hint! B is incorrect.`);
            triggerBattleEffect("correct-flash");
          }else {
            setCIsAvailable(false);
            setResultMessage(`You used Small Hint! C is incorrect.`);
            triggerBattleEffect("correct-flash");
          }
        }
        setNumOfItems(prev => ({
          ...prev,
          "Small Hint": prev["Small Hint"] - 1
        }));
        //setResultMessage(`You used Small Hint!`);
        //triggerBattleEffect("correct-flash");
        
      } else if(itemName === "Big Hint") {
        if(questionData?.Answer === "A"){
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if(randomNumber === 1) {
            setBIsAvailable(false);
            setCIsAvailable(false);
            setResultMessage(`You used Small Hint! B and C are incorrect.`);
        triggerBattleEffect("correct-flash");
          }else if(randomNumber === 2) {
            setCIsAvailable(false);
            setDIsAvailable(false);
            setResultMessage(`You used Small Hint! C and D are incorrect.`);
            triggerBattleEffect("correct-flash");
          }else {
            setDIsAvailable(false);
            setBIsAvailable(false);
            setResultMessage(`You used Small Hint! B and D are incorrect.`);
            triggerBattleEffect("correct-flash");
          }
        }else if(questionData?.Answer === "B"){
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if(randomNumber === 1) {
            setAIsAvailable(false);
            setCIsAvailable(false);
            setResultMessage(`You used Small Hint! A and C are incorrect.`);
            triggerBattleEffect("correct-flash");
          }else if(randomNumber === 2) {
            setCIsAvailable(false);
            setDIsAvailable(false);
            setResultMessage(`You used Small Hint! C and D are incorrect.`);
            triggerBattleEffect("correct-flash");
          }else {
            setDIsAvailable(false);
            setAIsAvailable(false)
            setResultMessage(`You used Small Hint! A and D are incorrect.`);
            triggerBattleEffect("correct-flash");
          }
        }else if(questionData?.Answer === "C"){
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if(randomNumber === 1) {
            setAIsAvailable(false);
            setBIsAvailable(false);
            setResultMessage(`You used Small Hint! A and B are incorrect.`);
            triggerBattleEffect("correct-flash");
          }else if(randomNumber === 2) {
            setBIsAvailable(false);
            setDIsAvailable(false);
            setResultMessage(`You used Small Hint! B and D are incorrect.`);
            triggerBattleEffect("correct-flash");
          }else {
            setDIsAvailable(false);
            setAIsAvailable(false);
            setResultMessage(`You used Small Hint! A and D are incorrect.`);
            triggerBattleEffect("correct-flash");
          }
        }else if(questionData?.Answer === "D"){
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if(randomNumber === 1) {
            setAIsAvailable(false);
            setBIsAvailable(false);
            setResultMessage(`You used Small Hint! A and B are incorrect.`);
            triggerBattleEffect("correct-flash");
          }else if(randomNumber === 2) {
            setBIsAvailable(false);
            setCIsAvailable(false)
            setResultMessage(`You used Small Hint! B and C are incorrect.`);
            triggerBattleEffect("correct-flash");
          }else {
            setCIsAvailable(false);
            setAIsAvailable(false);
            setResultMessage(`You used Small Hint! A and C are incorrect.`);
            triggerBattleEffect("correct-flash");
          }
        }
        setNumOfItems(prev => ({
            ...prev,
            "Big Hint": prev["Big Hint"] - 1
          }));
      }


      setShowItemChoices1(false);
      setShowItemChoices2(false);
    } catch (error) {
      console.error("Error using item:", error);
      setResultMessage("Something went wrong while using the item.");
    }
  };

  console.log({
    showAttackChoices,
    showItemChoices1,
    showItemChoices2,
    damageMultiplier,
    aIsAvailable,
    bIsAvailable,
    cIsAvailable,
    dIsAvailable
  });

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
          {!showAttackChoices && !showItemChoices1 && !showItemChoices2 ? (
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
                  className={`action-button ${selectedAnswer === "A" ? "selected" : ""} ${!aIsAvailable ? "itemHintDisabled" : ""}`}
                  onClick={() => handleAnswerClick("A")}
                  disabled={!!selectedAnswer || gameOver || !aIsAvailable}
                >
                  A. {questionData?.A}
                </button>

                <button
                  className={`action-button ${selectedAnswer === "B" ? "selected" : ""} ${!bIsAvailable ? "itemHintDisabled" : ""}`}
                  onClick={() => handleAnswerClick("B")}
                  disabled={!!selectedAnswer || gameOver || !bIsAvailable}
                >
                  B. {questionData?.B}
                </button>

                <button
                  className={`action-button ${selectedAnswer === "C" ? "selected" : ""} ${!cIsAvailable ? "itemHintDisabled" : ""}`}
                  onClick={() => handleAnswerClick("C")}
                  disabled={!!selectedAnswer || gameOver || !cIsAvailable}
                >
                  C. {questionData?.C}
                </button>

                <button
                  className={`action-button ${selectedAnswer === "D" ? "selected" : ""} ${!dIsAvailable ? "itemHintDisabled" : ""}`}
                  onClick={() => handleAnswerClick("D")}
                  disabled={!!selectedAnswer || gameOver || !dIsAvailable}
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
          ):showItemChoices1 ? (
            <>
              <div className="item-actions">
                
                <button
                  className={`action-button ${numOfItems['Mini Shield'] <= 0 ? 'itemHintDisabled' : ''}`}
                  onClick={() => handleUseItem("Mini Shield")}
                  disabled={gameOver || numOfItems["Mini Shield"] <= 0}
                >
                <img
                  src={mini}
                  style={{width:"30px", height:"30px", marginRight:"8px"}}
                />
                  Mini Shield ({numOfItems["Mini Shield"]})
                </button>
                <button
                  className={`action-button ${numOfItems['Big Shield'] <= 0 ? 'itemHintDisabled' : ''}`}
                  onClick={() => handleUseItem("Big Shield")}
                  disabled={gameOver || numOfItems["Big Shield"] <= 0}
                >
                  <img
                  src={big}
                  style={{width:"30px", height:"30px", marginRight:"8px"}}
                />
                  Big Shield ({numOfItems["Big Shield"]})
                </button>
                <button
                  className={`action-button ${numOfItems['Chug Jug'] <= 0 ? 'itemHintDisabled' : ''}`}
                  onClick={() => handleUseItem("Chug Jug")}
                  disabled={gameOver || numOfItems["Chug Jug"] <= 0}
                >
                  <img
                  src={chug}
                  style={{width:"30px", height:"30px", marginRight:"8px"}}
                />
                  Chug Jug ({numOfItems["Chug Jug"]})
                </button>
                <button
                  className={`action-button ${numOfItems['Damage Boost'] <= 0 ? 'itemHintDisabled' : ''}`}
                  onClick={() => handleUseItem("Damage Boost")}
                  disabled={gameOver || numOfItems["Damage Boost"] <= 0}
                >
                  <img
                  src={chug}
                  style={{width:"30px", height:"30px", marginRight:"8px"}}
                />
                  Damage Boost ({numOfItems["Damage Boost"]})
                </button>
                <button
                  className="action-button"
                  onClick={() => {
                    setShowItemChoices1(false);
                    setResultMessage("");
                  }}
                  disabled={gameOver}
                >
                  Back
                </button>
                <button
                  className="action-button"
                  onClick={() => {
                    setShowItemChoices1(false);
                    setShowItemChoices2(true);
                    setResultMessage("");
                  }}
                  disabled={gameOver}
                >
                  Next
                </button>

              </div>
            </>
           ) : showItemChoices2 ? (
            <>
              <div className="item-actions">
                
                <button
                  className={`action-button ${numOfItems['Damage Mega Boost'] <= 0 ? 'itemHintDisabled' : ''}`}
                  onClick={() => handleUseItem("Damage Mega Boost")}
                  disabled={gameOver || numOfItems["Damage Mega Boost"] <= 0}
                >
                <img
                  src={mini}
                  style={{width:"30px", height:"30px", marginRight:"8px"}}
                />
                  Damage Mega Boost ({numOfItems["Damage Mega Boost"]})
                </button>
                <button
                  className={`action-button ${numOfItems['Damage Ultra Boost'] <= 0 ? 'itemHintDisabled' : ''}`}
                  onClick={() => handleUseItem("Damage Ultra Boost")}
                  disabled={gameOver || numOfItems["Damage Ultra Boost"] <= 0}
                >
                  <img
                  src={big}
                  style={{width:"30px", height:"30px", marginRight:"8px"}}
                />
                  Damage Ultra Boost ({numOfItems["Damage Ultra Boost"]})
                </button>
                <button
                  className={`action-button ${numOfItems['Small Hint'] <= 0 ? 'itemHintDisabled' : ''}`}
                  onClick={() => handleUseItem("Small Hint")}
                  disabled={gameOver || numOfItems["Small Hint"] <= 0}
                >
                  <img
                  src={chug}
                  style={{width:"30px", height:"30px", marginRight:"8px"}}
                />
                  Small Hint ({numOfItems["Small Hint"]})
                </button>
                <button
                  className={`action-button ${numOfItems['Big Hint'] <= 0 ? 'itemHintDisabled' : ''}`}
                  onClick={() => handleUseItem("Big Hint")}
                  disabled={gameOver || numOfItems["Big Hint"] <= 0}
                >
                  <img
                  src={chug}
                  style={{width:"30px", height:"30px", marginRight:"8px"}}
                />
                  Big Hint ({numOfItems["Big Hint"]})
                </button>
                <button
                  className="action-button"
                  onClick={() => {
                    setShowItemChoices2(false);
                    setShowItemChoices1(true)
                    setResultMessage("");
                  }}
                  disabled={gameOver}
                >
                  Back
                </button>

              </div>
            </>
           ) : null
            } 
          
        </div>
      </div>
    </div>
  );
}

export default BattleScreen;