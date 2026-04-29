import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BattleScreen.css";
import mini from "../Images/miniShield.png"
import big from "../Images/bigShield.png"
import chug from "../Images/chugJug.png"

import elgato1 from "../Images/elgato_full_1.png"
import elgato2 from "../Images/elgato_full_2.png"
import elgato3 from "../Images/elgato_full_3.png"
import elgato4 from "../Images/elgato_full_4.png"
import molecool from "../Images/molecool.png"

const tutorialQuestions = [
  {
    question: "What instrument typically has six strings and is played by strumming or plucking?",
    A: "Guitar",
    B: "Piano",
    C: "Trumpet",
    D: "Drum",
    Answer: "A",
  },
  {
    question: "Who is widely known as the 'King of Pop'?",
    A: "Elvis Presley",
    B: "Michael Jackson",
    C: "Bob Dylan",
    D: "Prince",
    Answer: "B",
  },
  {
    question: "Which of these is a percussion instrument?",
    A: "Flute",
    B: "Violin",
    C: "Snare Drum",
    D: "Clarinet",
    Answer: "C",
  },
  {
    question: "What is a person who performs music by singing called?",
    A: "Conductor",
    B: "Musician",
    C: "Dancer",
    D: "Vocalist",
    Answer: "D",
  },
  {
    question: "Which primary color is often associated with the music genre 'the blues'?",
    A: "Red",
    B: "Green",
    C: "Blue",
    D: "Yellow",
    Answer: "C",
  },
  {
    question: "What does the musical term 'allegro' typically mean?",
    A: "Slow",
    B: "Very Slow",
    C: "Fast",
    D: "Moderate",
    Answer: "C",
  },
  {
    question: "Which famous city is considered the birthplace of jazz music?",
    A: "Chicago",
    B: "New York City",
    C: "New Orleans",
    D: "Los Angeles",
    Answer: "C",
  },
  {
    question: "Which iconic band released the album 'The Dark Side of the Moon'?",
    A: "Led Zeppelin",
    B: "The Rolling Stones",
    C: "Pink Floyd",
    D: "Queen",
    Answer: "C",
  },
];


function TutorialScreen() {
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


  const[tutorialState, setTutorialState] = useState(0);
  const[tutText, setTutText] = useState("Click this speech bubble when you're ready for us to start the tutorial!");
  const[img, setImg]= useState(elgato1)
  const[overlayHeight, setOverlayHeight] = useState("100vh")
  const[itemDisable, setItemDisable] = useState(true)
  const[attackDisable, setAttackDisable] = useState(false);
  

  const [playerHP, setPlayerHP] = useState(() => {
    const saved = sessionStorage.getItem("playerHP");
    return saved !== null ? Number(saved) : 100;
  });

  const [enemyHP, setEnemyHP] = useState(() => {
    const saved = sessionStorage.getItem("enemyHP");
    return saved !== null ? Number(saved) : 100;
  });

  const [tutorialQuestionIndex, setTutorialQuestionIndex] = useState(0);
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

      const nextQuestion = tutorialQuestions[tutorialQuestionIndex];
      if (!nextQuestion) {
        setQuestionError("No tutorial questions available.");
        return;
      }

      setQuestionData(nextQuestion);
    } catch (error) {
      console.error("Error loading tutorial question:", error);
      setQuestionError("Could not load question.");
    } finally {
      setLoadingQuestion(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [tutorialQuestionIndex]);

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
    doTutorial();
  }, [playerHP, enemyHP, tutorialState]);

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
        setImg(elgato4)
        setTutorialState(5)
      } else {
        setResultMessage(`Incorrect! The answer was ${questionData.Answer}.`);
        triggerBattleEffect("wrong-flash");
        setDamageMultiplier(1.0);
        setImg(elgato3)
        setTutorialState(-5)
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
      } else if(itemName === "Big Shield") {
        setResultMessage("You used Big Shield! You gain 20 HP.");
        triggerBattleEffect("correct-flash");
      } else if(itemName === "Chug Jug") {
        setResultMessage("You used Chug Jug! You gain 50 HP.");
        triggerBattleEffect("correct-flash");
      } else if(itemName === "Damage Boost") {
        setResultMessage("You used Damage Boost! Your next attack will be stronger.");
        triggerBattleEffect("correct-flash");
      } else if(itemName === "Damage Mega Boost") {
        setResultMessage("You used Damage Mega Boost! Your next attack will be even stronger.");
        triggerBattleEffect("correct-flash");
      } else if(itemName === "Damage Ultra Boost") {
        setResultMessage("You used Damage Ultra Boost! Your next attack will be the strongest.");
        triggerBattleEffect("correct-flash");
      }


      setShowItemChoices1(false);
      setShowItemChoices2(false);
      setTutorialState(tutorialState + 1)
    } catch (error) {
      console.error("Error using item:", error);
      setResultMessage("Something went wrong while using the item.");
    }
  };

  console.log({
    showAttackChoices,
    showItemChoices1,
    showItemChoices2
  });




  const doTutorial = () => {
    console.log("TutorialState: " + tutorialState)
    switch(tutorialState) {
      case 0:
        break;
      case 1:
        setTutText("Welcome to the Tutorial! I am your (insert cat pun) friend Purrwin. " +
          "Please click the speech bubble to continue.");
        setImg(elgato2)
        break;
      case 2:
        setTutText("First things first, this is your battle interface. It is where you will battle " +
          "some science themed enemies by answering the study questions presented to you. Click to continue.");
        setImg(elgato1)
        break;
      case 3:
        setTutText("When it's your turn, you have two choices to make. Let's start by clicking the "+
          "'Attack' button.");
        setOverlayHeight("70vh")
        break;
      case 4:
        setTutText("Now that you clicked 'Attack,' you'll see more boxes appear that have answers " +
          "to the question presented to you. If you choose the correct answer, you'll do damage to the enemy! " +
          "Click an answer, even if you don't know it, and you'll get to see what happens.");
        break;
      case 5:
        setTutText("Nice! Notice that our Professor here has 10 less HP than when we started. " +
          "Keep in mind, you'll take damage if you get it wrong. Now, click 'Next Question' to continue.");
        break;
      case -5:
        setTutText("Ouch! Notice that you took some damage, you have 10 less HP than when we started. " +
          "You'll get em next time, and you'll deal damage to your opponent if you get it right. Now, click 'Next Question' to continue.");
        break;
      case 6:
        setTutText("Let's try clicking 'Item,' this time, you should see more boxes appear with " +
          "some very yummy looking blue items to use. Some of these will heal you or do extra " +
          "damage to your enemy. After you use an Item, you will still be able to make your attack.");
        setImg(elgato1)
        break;
      case 7:
        setTutText("Try clicking an item, any item!")
        break;
      case 8:
        setTutText("Yummy! After using an item, you'll still be able to make an attack. Now you should have all the information you need to play this game! Get out there " + 
          "and have fun and learn something while doing it! Click the speech bubble to go back to the main menu");
          setOverlayHeight("100vh")
        setImg(elgato2)
        break;
      default:
        navigate("/prebattle");
        break;

    }
  }

  const handleImage = () => {
    switch (imgNum) {
      case 1:
        return ELGATO_1;
        break;
      case 2:
        return ELGATO_2;
        break;
      default:
        console.log("invalid image number: " + imgNum)
    }
  }

  return (
    <div className={`battle-screen ${battleEffect}`}>
      <div style={{position:"fixed", width:"100%", height:`${overlayHeight}`, backgroundColor:"rgba(0,0,0,0.5)", zIndex:"100"}} >
        <div style={{display:"flex", width:"fit-content", maxWidth:"70rem", height:"fit-content"}}>
          <img src={img} style={{width:"30rem", minWidth:"30rem", imageRendering:"pixelated"}}/>
          <div id="speechBubb" style={{height:"fit-content"}}
          onClick={() => {
            if(tutorialState >= 0 && tutorialState < 3 || tutorialState > 6) {
              console.log(tutorialState);
              setTutorialState(tutorialState + 1);
              console.log(tutorialState);
            }
          }}>
            
            <p style={{background:"#efedee", width:"100%", height:"100%", margin:"0"}}>
              {tutText}
            </p>
          </div>
          
        </div>
        
      </div>
      <div className="battlefield">
        <div className="enemy-section" style={{display:"flex", flexDirection:"row"}}>
          <div className="enemy-card" id="monBorder">
            <div className="battle-card-header">
              <span className="battle-name">Molecoole</span>
              <span className="battle-level">Lv.1</span>
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

          <div>
            <img
              className="enemy-sprite"
              src={molecool}
              alt="Enemy"
              onError={(e) => {
                e.target.style.display = "none";
              }}
              style={{
                imageRendering:"pixelated",
                width:"10rem"
              }}
            />

            <div className="enemy-platform" style={{justifySelf:"center"}}></div>
          </div>
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
                  onClick={() => {
                    setItemDisable(false);
                    setAttackDisable(true);
                    setTutorialState(tutorialState + 1);
                    handleAttackClick();
                  }}
                  disabled={attackDisable}
                >
                  Attack
                </button>

                <button 
                  className="action-button primary" 
                  onClick={() => {
                    setTutorialState(7);
                    handleItemClick();

                  }}
                  disabled={itemDisable}
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
                onClick={() => {
                  setTutorialState(6);
                  setTutorialQuestionIndex((prev) => Math.min(prev + 1, tutorialQuestions.length - 1));
                }}
                disabled={gameOver || !selectedAnswer}
              >
                Next Question
              </button>
            </>
          ):showItemChoices1 ? (
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
                <button
                  className="action-button"
                  onClick={() => handleUseItem("Damage Boost")}
                  disabled={gameOver}
                >
                  <img
                  src={chug}
                  style={{width:"30px", height:"30px", marginRight:"8px"}}
                />
                  Damage Boost
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
                  className="action-button"
                  onClick={() => handleUseItem("Damage Mega Boost")}
                  disabled={gameOver}
                >
                <img
                  src={mini}
                  style={{width:"30px", height:"30px", marginRight:"8px"}}
                />
                  Damage Mega Boost
                </button>
                <button
                  className="action-button"
                  onClick={() => handleUseItem("Damage Ultra Boost")}
                  disabled={gameOver}
                >
                  <img
                  src={big}
                  style={{width:"30px", height:"30px", marginRight:"8px"}}
                />
                  Damage Ultra Boost
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
                  Chug Jug 2
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
                  Chug Jug 2
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

export default TutorialScreen;