import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BattleScreen.css";
import mini from "../Images/miniShield.png";
import big from "../Images/bigShield.png";
import chug from "../Images/chugJug.png";
import dmg1 from "../Images/dmg1.png";
import dmg2 from "../Images/dmg2.png";
import dmg3 from "../Images/dmg3.png";
import meat1 from "../Images/RedSteak.png";
import meat2 from "../Images/PurpSteak.png";
import meat3 from "../Images/BluSteak.png";
import qHelp1 from "../Images/qMarkPowerup.png";
import qHelp2 from "../Images/qMarkPowerup_Orange.png";
import qSkip from "../Images/qSkipPowerup.png";

import plub from "../Images/maybe neutral plub.png";
import molecoole from "../Images/molecool.png";
import mathWiz from "../Images/math wiz.png";
import erlenmeyer from "../Images/erlenmeyer.png";
import qMarkGuy from "../Images/q mark.png";

import player from "../Images/player.png";
import splayer from "../Images/splayer.png";


const parseAIFormattedQuiz = (rawQuizText) => {
  if (!rawQuizText || !rawQuizText.trim()) {
    return { questions: [] };
  }

  const blocks = rawQuizText
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  return {
    questions: blocks.map((block, index) => {
      const question = {
        question: "",
        a: "",
        b: "",
        c: "",
        d: "",
        correct_answer: "",
      };

      block.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.toLowerCase().startsWith("question:")) {
          question.question = trimmed.slice(trimmed.indexOf(":") + 1).trim();
        } else if (trimmed.startsWith("A.")) {
          question.a = trimmed.slice(2).trim();
        } else if (trimmed.startsWith("B.")) {
          question.b = trimmed.slice(2).trim();
        } else if (trimmed.startsWith("C.")) {
          question.c = trimmed.slice(2).trim();
        } else if (trimmed.startsWith("D.")) {
          question.d = trimmed.slice(2).trim();
        } else if (trimmed.toLowerCase().startsWith("correct answer:")) {
          question.correct_answer = trimmed
            .slice(trimmed.indexOf(":") + 1)
            .trim()
            .toUpperCase();
        }
      });

      const missingFields = [
        "question",
        "a",
        "b",
        "c",
        "d",
        "correct_answer",
      ].filter((key) => !question[key]);

      if (missingFields.length > 0) {
        throw new Error(`Invalid quiz block ${index + 1}: missing ${missingFields.join(", ")}`);
      }

      return question;
    }),
  };
};

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
  const [difficulty, setDifficulty] = useState(1);
  const [questionsRight, setQuestionsRight] = useState(0);
  const [questionsWrong, setQuestionsWrong] = useState(0);

  const [enemyLvl, setEnemyLvl] = useState(0);
  const [enemySprite, setEnemySprite] = useState(null);
  const [enemyName, setEnemyName] = useState("");

  const [playerLvl, setPlayerLvl] = useState(0);
  const [playerSprite, setPlayerSprite] = useState(player);


  const [battleQuestions, setBattleQuestions] = useState([]);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [saveQuizMessage, setSaveQuizMessage] = useState("");
  const [quizName, setQuizName] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizSaved, setQuizSaved] = useState(false);

  const [numOfItems, setNumOfItems] = useState({
    "Mini Shield": 2,
    "Big Shield": 1,
    "Chug Jug": 2,
    "Damage Boost": 1,
    "Damage Mega Boost": 1,
    "Damage Ultra Boost": 1,
    "Small Hint": 1,
    "Big Hint": 1,
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
    "";

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

  //const effectiveDifficulty = subject === "biology" ? selectedDifficulty : 1;

  const fullQuestion = useMemo(() => {
    return questionData?.question || "";
  }, [questionData]);

  const fetchQuestion = async () => {

    if(enemyName == "") {
      var numbah = Math.floor(Math.random() * (100) + 1);
      setPlayerLvl(numbah);
      if(numbah == 69) setPlayerSprite(splayer);
      setEnemyLvl(Math.floor(Math.random() * (100) + 1));
      switch ( Math.floor(Math.random() * 5 + 1) ) {
        case 1:
          setEnemyName("Molecoole");
          setEnemySprite(molecoole);
          break;
        case 2:
          setEnemyName("Plub");
          setEnemySprite(plub);
          break;
        case 3:
          setEnemyName("Math Wiz");
          setEnemySprite(mathWiz);
          break;
        case 4:
          setEnemyName("The Mixture");
          setEnemySprite(erlenmeyer);
          break;
        case 5:
          setEnemyName("?");
          setEnemySprite(qMarkGuy);
          break;
        default:
          break;
      }
    }



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
      console.log("FETCHING DIFFICULTY:", difficulty);
      console.log("FETCHING QUIZ:", rawQuiz);

      const response = await fetch("https://api.cerebrawl.me/battle/generateQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz: rawQuiz,
          difficulty: difficulty,
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", response.status, errorText);
        throw new Error(`Failed to fetch question: ${response.status}`);
      }

      const data = await response.json();
      setQuestionData(data);

      setBattleQuestions((prev) => [
        ...prev,
        {
          question: data.question,
          a: data.A,
          b: data.B,
          c: data.C,
          d: data.D,
          correct_answer: data.Answer,
        },
      ]);
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
      setQuizName(`${subject} Battle Quiz`);
    } else if (playerHP <= 0) {
      setPlayerHP(0);
      setGameOver(true);
      setGameResult("loss");
      setShowAttackChoices(false);
      setResultMessage("You were defeated.");
      setQuizName(`${subject} Battle Quiz`);
    }
  }, [playerHP, enemyHP, subject]);

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

  const handleSaveQuiz = async () => {
    const token = localStorage.getItem("token");
    const quiz = sessionStorage.getItem("battleQuiz") || "";
    const trimmedQuizName = quizName.trim();

    console.log(quiz);

    if (!token) {
      setSaveQuizMessage("You need to sign in before saving a quiz.");
      return;
    }

    if (!trimmedQuizName) {
      setSaveQuizMessage("Please enter a quiz name.");
      return;
    }

    if (battleQuestions.length === 0) {
      setSaveQuizMessage("There are no questions to save yet.");
      return;
    }

    let formattedQuiz;
    try {
      formattedQuiz = parseAIFormattedQuiz(quiz);
    } catch (err) {
      setSaveQuizMessage("Could not parse quiz text into questions.");
      return;
    }

    if (!formattedQuiz.questions.length) {
      setSaveQuizMessage("No questions found in the provided quiz text.");
      return;
    }

    try {
      setSavingQuiz(true);
      setSaveQuizMessage("");

      const response = await fetch("https://api.cerebrawl.me/quizzes/createQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quiz: {
            name: trimmedQuizName,
            subject: subject,
            difficulty: selectedDifficulty,
            description: quizDescription.trim(),
          },
          questions: formattedQuiz.questions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to save quiz.");
      }

      setQuizSaved(true);
      setSaveQuizMessage("Quiz saved to Catalogue.");
    } catch (error) {
      console.error("Save quiz error:", error);
      setSaveQuizMessage(error.message || "Could not save quiz.");
    } finally {
      setSavingQuiz(false);
    }
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
          damageMultiplier: damageMultiplier,
          difficulty: difficulty,
          questionsRight: questionsRight,
          questionsWrong: questionsWrong,
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
      setDifficulty(result.difficulty);
      setQuestionsRight(result.questionsRight);
      setQuestionsWrong(result.questionsWrong);

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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemName: itemName,
          playerHP: playerHP,
          enemyHP: enemyHP,
          damageMultiplier: damageMultiplier,
        }),
      });

      const result = await response.json();
      console.log("Use Item API RESPONSE:", result);

      setPlayerHP(Math.max(result.playerHP, 0));
      setEnemyHP(Math.max(result.enemyHP, 0));
      setResultMessage(result.result);
      setDamageMultiplier(result.damageMultiplier);

      if (itemName === "Mini Shield") {
        setResultMessage("You used Mini Shield! You gain 10 HP.");
        triggerBattleEffect("correct-flash");
        setNumOfItems((prev) => ({
          ...prev,
          "Mini Shield": prev["Mini Shield"] - 1,
        }));
      } else if (itemName === "Big Shield") {
        setResultMessage("You used Big Shield! You gain 20 HP.");
        triggerBattleEffect("correct-flash");
        setNumOfItems((prev) => ({
          ...prev,
          "Big Shield": prev["Big Shield"] - 1,
        }));
      } else if (itemName === "Chug Jug") {
        setResultMessage("You used Chug Jug! You gain 50 HP.");
        triggerBattleEffect("correct-flash");
        setNumOfItems((prev) => ({
          ...prev,
          "Chug Jug": prev["Chug Jug"] - 1,
        }));
      } else if (itemName === "Damage Boost") {
        setResultMessage("You used Damage Boost! Your next attack will be stronger.");
        triggerBattleEffect("correct-flash");
        setNumOfItems((prev) => ({
          ...prev,
          "Damage Boost": prev["Damage Boost"] - 1,
        }));
      } else if (itemName === "Damage Mega Boost") {
        setResultMessage("You used Damage Mega Boost! Your next attack will be even stronger.");
        triggerBattleEffect("correct-flash");
        setNumOfItems((prev) => ({
          ...prev,
          "Damage Mega Boost": prev["Damage Mega Boost"] - 1,
        }));
      } else if (itemName === "Damage Ultra Boost") {
        setResultMessage("You used Damage Ultra Boost! Your next attack will be the strongest.");
        triggerBattleEffect("correct-flash");
        setNumOfItems((prev) => ({
          ...prev,
          "Damage Ultra Boost": prev["Damage Ultra Boost"] - 1,
        }));
      } else if (itemName === "Small Hint") {
        if (questionData?.Answer === "A") {
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if (randomNumber === 1) {
            setBIsAvailable(false);
            setResultMessage("You used Small Hint! B is incorrect.");
            triggerBattleEffect("correct-flash");
          } else if (randomNumber === 2) {
            setCIsAvailable(false);
            setResultMessage("You used Small Hint! C is incorrect.");
            triggerBattleEffect("correct-flash");
          } else {
            setDIsAvailable(false);
            setResultMessage("You used Small Hint! D is incorrect.");
            triggerBattleEffect("correct-flash");
          }
        } else if (questionData?.Answer === "B") {
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if (randomNumber === 1) {
            setAIsAvailable(false);
            setResultMessage("You used Small Hint! A is incorrect.");
            triggerBattleEffect("correct-flash");
          } else if (randomNumber === 2) {
            setCIsAvailable(false);
            setResultMessage("You used Small Hint! C is incorrect.");
            triggerBattleEffect("correct-flash");
          } else {
            setDIsAvailable(false);
            setResultMessage("You used Small Hint! D is incorrect.");
            triggerBattleEffect("correct-flash");
          }
        } else if (questionData?.Answer === "C") {
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if (randomNumber === 1) {
            setAIsAvailable(false);
            setResultMessage("You used Small Hint! A is incorrect.");
            triggerBattleEffect("correct-flash");
          } else if (randomNumber === 2) {
            setBIsAvailable(false);
            setResultMessage("You used Small Hint! B is incorrect.");
            triggerBattleEffect("correct-flash");
          } else {
            setDIsAvailable(false);
            setResultMessage("You used Small Hint! D is incorrect.");
            triggerBattleEffect("correct-flash");
          }
        } else if (questionData?.Answer === "D") {
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if (randomNumber === 1) {
            setAIsAvailable(false);
            setResultMessage("You used Small Hint! A is incorrect.");
            triggerBattleEffect("correct-flash");
          } else if (randomNumber === 2) {
            setBIsAvailable(false);
            setResultMessage("You used Small Hint! B is incorrect.");
            triggerBattleEffect("correct-flash");
          } else {
            setCIsAvailable(false);
            setResultMessage("You used Small Hint! C is incorrect.");
            triggerBattleEffect("correct-flash");
          }
        }

        setNumOfItems((prev) => ({
          ...prev,
          "Small Hint": prev["Small Hint"] - 1,
        }));
      } else if (itemName === "Big Hint") {
        if (questionData?.Answer === "A") {
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if (randomNumber === 1) {
            setBIsAvailable(false);
            setCIsAvailable(false);
            setResultMessage("You used Big Hint! B and C are incorrect.");
            triggerBattleEffect("correct-flash");
          } else if (randomNumber === 2) {
            setCIsAvailable(false);
            setDIsAvailable(false);
            setResultMessage("You used Big Hint! C and D are incorrect.");
            triggerBattleEffect("correct-flash");
          } else {
            setDIsAvailable(false);
            setBIsAvailable(false);
            setResultMessage("You used Big Hint! B and D are incorrect.");
            triggerBattleEffect("correct-flash");
          }
        } else if (questionData?.Answer === "B") {
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if (randomNumber === 1) {
            setAIsAvailable(false);
            setCIsAvailable(false);
            setResultMessage("You used Big Hint! A and C are incorrect.");
            triggerBattleEffect("correct-flash");
          } else if (randomNumber === 2) {
            setCIsAvailable(false);
            setDIsAvailable(false);
            setResultMessage("You used Big Hint! C and D are incorrect.");
            triggerBattleEffect("correct-flash");
          } else {
            setDIsAvailable(false);
            setAIsAvailable(false);
            setResultMessage("You used Big Hint! A and D are incorrect.");
            triggerBattleEffect("correct-flash");
          }
        } else if (questionData?.Answer === "C") {
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if (randomNumber === 1) {
            setAIsAvailable(false);
            setBIsAvailable(false);
            setResultMessage("You used Big Hint! A and B are incorrect.");
            triggerBattleEffect("correct-flash");
          } else if (randomNumber === 2) {
            setBIsAvailable(false);
            setDIsAvailable(false);
            setResultMessage("You used Big Hint! B and D are incorrect.");
            triggerBattleEffect("correct-flash");
          } else {
            setDIsAvailable(false);
            setAIsAvailable(false);
            setResultMessage("You used Big Hint! A and D are incorrect.");
            triggerBattleEffect("correct-flash");
          }
        } else if (questionData?.Answer === "D") {
          const randomNumber = Math.floor(Math.random() * 3) + 1;
          if (randomNumber === 1) {
            setAIsAvailable(false);
            setBIsAvailable(false);
            setResultMessage("You used Big Hint! A and B are incorrect.");
            triggerBattleEffect("correct-flash");
          } else if (randomNumber === 2) {
            setBIsAvailable(false);
            setCIsAvailable(false);
            setResultMessage("You used Big Hint! B and C are incorrect.");
            triggerBattleEffect("correct-flash");
          } else {
            setCIsAvailable(false);
            setAIsAvailable(false);
            setResultMessage("You used Big Hint! A and C are incorrect.");
            triggerBattleEffect("correct-flash");
          }
        }

        setNumOfItems((prev) => ({
          ...prev,
          "Big Hint": prev["Big Hint"] - 1,
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
    dIsAvailable,
  });

  return (
    <div className={`battle-screen ${battleEffect}`}>
      <div className="battlefield">
        <div className="enemy-section">
          <div className="enemy-card" id="monBorder">
            <div className="battle-card-header">
              <span className="battle-name">{enemyName}</span>
              <span className="battle-level">Lv.{enemyLvl}</span>
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
            src={enemySprite}
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
            src={playerSprite}
            alt="Player"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />

          <div className="player-platform"></div>

          <div className="player-card" id="monBorder">
            <div className="battle-card-header">
              <span className="battle-name">Student</span>
              <span className="battle-level">Lv.{playerLvl}</span>
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
          <img
            className="player-sprite"
            src={player}
            alt="Player"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
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

              <div className="save-quiz-input-wrap">
                <input
                  type="text"
                  className="save-quiz-input"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                  placeholder="Enter quiz name"
                  maxLength={255}
                />
              </div>

              <div className="save-quiz-input-wrap">
                <input
                  type="text"
                  className="save-quiz-input"
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  placeholder="Enter quiz description"
                  maxLength={255}
                />
              </div>

              <div className="game-over-actions">
                <button
                  className="game-over-button"
                  onClick={handleSaveQuiz}
                  disabled={savingQuiz || quizSaved}
                >
                  {quizSaved ? "Saved" : savingQuiz ? "Saving..." : "Save Quiz"}
                </button>

                <button className="game-over-button" onClick={handleBackToMenu}>
                  Back to Main Menu
                </button>
              </div>

              {saveQuizMessage && (
                <p className="save-quiz-message">{saveQuizMessage}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bottom-panel">
        <div className="question-panel" id="picBorder">
          {loadingQuestion && <p className="question-text">Loading question.</p>}

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
          {!showAttackChoices && !showItemChoices1 && !showItemChoices2 ? (
            <div className="top-actions">
              <button
                className="action-button primary"
                onClick={handleAttackClick}
                disabled={loadingQuestion || !!questionError || gameOver}
              >
                Attack
              </button>
              <button
                className="action-button primary"
                onClick={handleItemClick}
                disabled={loadingQuestion || !!questionError || gameOver}
              >
                Item
              </button>
            </div>
          ) : showAttackChoices ? (
            <>
              <div className="answer-actions">
                <button
                  className={`action-button ${selectedAnswer === "A" ? "selected" : ""} ${!aIsAvailable ? "itemHintDisabled" : ""}`}
                  onClick={() => handleAnswerClick("A")}
                  disabled={!!selectedAnswer || !aIsAvailable || gameOver}
                >
                  A. {questionData?.A}
                </button>
                <button
                  className={`action-button ${selectedAnswer === "B" ? "selected" : ""} ${!bIsAvailable ? "itemHintDisabled" : ""}`}
                  onClick={() => handleAnswerClick("B")}
                  disabled={!!selectedAnswer || !bIsAvailable || gameOver}
                >
                  B. {questionData?.B}
                </button>
                <button
                  className={`action-button ${selectedAnswer === "C" ? "selected" : ""} ${!cIsAvailable ? "itemHintDisabled" : ""}`}
                  onClick={() => handleAnswerClick("C")}
                  disabled={!!selectedAnswer || !cIsAvailable || gameOver}
                >
                  C. {questionData?.C}
                </button>
                <button
                  className={`action-button ${selectedAnswer === "D" ? "selected" : ""} ${!dIsAvailable ? "itemHintDisabled" : ""}`}
                  onClick={() => handleAnswerClick("D")}
                  disabled={!!selectedAnswer || !dIsAvailable || gameOver}
                >
                  D. {questionData?.D}
                </button>
              </div>

              <button
                className="action-button next-button"
                onClick={fetchQuestion}
                disabled={!selectedAnswer || gameOver}
              >
                Next Question
              </button>
            </>
          ) : showItemChoices1 ? (
            <>
              <div className="item-actions">
                <button
                  className={`action-button ${numOfItems["Mini Shield"] <= 0 ? "itemHintDisabled" : ""}`}
                  onClick={() => handleUseItem("Mini Shield")}
                  disabled={gameOver || numOfItems["Mini Shield"] <= 0}
                >
                  <img
                    src={meat1}
                    style={{ width: "30px", height: "30px", marginRight: "8px" }}
                  />
                  Meat ({numOfItems["Mini Shield"]})
                </button>

                <button
                  className={`action-button ${numOfItems["Big Shield"] <= 0 ? "itemHintDisabled" : ""}`}
                  onClick={() => handleUseItem("Big Shield")}
                  disabled={gameOver || numOfItems["Big Shield"] <= 0}
                >
                  <img
                    src={meat2}
                    style={{ width: "30px", height: "30px", marginRight: "8px" }}
                  />
                  Super Meat ({numOfItems["Big Shield"]})
                </button>

                <button
                  className={`action-button ${numOfItems["Chug Jug"] <= 0 ? "itemHintDisabled" : ""}`}
                  onClick={() => handleUseItem("Chug Jug")}
                  disabled={gameOver || numOfItems["Chug Jug"] <= 0}
                >
                  <img
                    src={meat3}
                    style={{ width: "30px", height: "30px", marginRight: "8px" }}
                  />
                  Mega Meat ({numOfItems["Chug Jug"]})
                </button>

                <button
                  className={`action-button ${numOfItems["Damage Boost"] <= 0 ? "itemHintDisabled" : ""}`}
                  onClick={() => handleUseItem("Damage Boost")}
                  disabled={gameOver || numOfItems["Damage Boost"] <= 0}
                >
                  <img
                    src={dmg3}
                    style={{ width: "30px", height: "30px", marginRight: "8px" }}
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
                  className={`action-button ${numOfItems["Damage Mega Boost"] <= 0 ? "itemHintDisabled" : ""}`}
                  onClick={() => handleUseItem("Damage Mega Boost")}
                  disabled={gameOver || numOfItems["Damage Mega Boost"] <= 0}
                >
                  <img
                    src={dmg2}
                    style={{ width: "30px", height: "30px", marginRight: "8px" }}
                  />
                  Damage Mega Boost ({numOfItems["Damage Mega Boost"]})
                </button>

                <button
                  className={`action-button ${numOfItems["Damage Ultra Boost"] <= 0 ? "itemHintDisabled" : ""}`}
                  onClick={() => handleUseItem("Damage Ultra Boost")}
                  disabled={gameOver || numOfItems["Damage Ultra Boost"] <= 0}
                >
                  <img
                    src={dmg1}
                    style={{ width: "30px", height: "30px", marginRight: "8px" }}
                  />
                  Damage Ultra Boost ({numOfItems["Damage Ultra Boost"]})
                </button>

                <button
                  className={`action-button ${numOfItems["Small Hint"] <= 0 ? "itemHintDisabled" : ""}`}
                  onClick={() => handleUseItem("Small Hint")}
                  disabled={gameOver || numOfItems["Small Hint"] <= 0}
                >
                  <img
                    src={qHelp1}
                    style={{ width: "30px", height: "30px", marginRight: "8px" }}
                  />
                  Small Hint ({numOfItems["Small Hint"]})
                </button>

                <button
                  className={`action-button ${numOfItems["Big Hint"] <= 0 ? "itemHintDisabled" : ""}`}
                  onClick={() => handleUseItem("Big Hint")}
                  disabled={gameOver || numOfItems["Big Hint"] <= 0}
                >
                  <img
                    src={qHelp2}
                    style={{ width: "30px", height: "30px", marginRight: "8px" }}
                  />
                  Big Hint ({numOfItems["Big Hint"]})
                </button>

                <button
                  className="action-button"
                  onClick={() => {
                    setShowItemChoices2(false);
                    setShowItemChoices1(true);
                    setResultMessage("");
                  }}
                  disabled={gameOver}
                >
                  Back
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default BattleScreen;